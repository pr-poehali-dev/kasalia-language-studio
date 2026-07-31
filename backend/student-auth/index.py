import json
import os
import hashlib
import secrets
import datetime
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Кабинет ученика и панель преподавателя студии Kasalia.
    Ученик: вход по телефону+паролю (POST без action) и получение материалов/заданий
    по токену сессии (GET без action, заголовок X-Session-Token).
    Преподаватель: все запросы требуют заголовок X-Teacher-Password с верным паролем.
      GET ?action=students — список учеников с их заданиями и материалами
      POST action=add-student — добавить ученика (fullName, kidName, phone, password, course)
      POST action=add-homework — выдать задание (studentId, title, description, dueDate)
      POST action=add-material — добавить материал (studentId, title, description, fileUrl)
    Args: event с httpMethod, headers, body, queryStringParameters; context с request_id.
    Returns: HTTP-ответ с данными ученика/преподавателя или результатом операции.
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token, X-Teacher-Password',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**cors, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = event.get('headers', {})
    params = event.get('queryStringParameters') or {}
    action = params.get('action')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    def check_teacher():
        teacher_password = headers.get('X-Teacher-Password') or headers.get('x-teacher-password')
        expected = os.environ.get('TEACHER_PASSWORD')
        return expected and teacher_password == expected

    try:
        if action:
            if not check_teacher():
                return {
                    'statusCode': 403,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Неверный пароль преподавателя'}),
                }

            if method == 'GET' and action == 'students':
                with conn.cursor() as cur:
                    cur.execute(
                        f'SELECT id, full_name, kid_name, phone, course FROM {schema}.students ORDER BY id DESC'
                    )
                    students_rows = cur.fetchall()

                    result = []
                    for s in students_rows:
                        sid = s[0]
                        cur.execute(
                            f'SELECT id, title, description, due_date, status FROM {schema}.student_homework WHERE student_id = %s ORDER BY due_date ASC NULLS LAST',
                            (sid,),
                        )
                        homework = [
                            {
                                'id': r[0], 'title': r[1], 'description': r[2],
                                'dueDate': r[3].isoformat() if r[3] else None, 'status': r[4],
                            }
                            for r in cur.fetchall()
                        ]
                        cur.execute(
                            f'SELECT id, title, description, file_url, created_at FROM {schema}.student_materials WHERE student_id = %s ORDER BY created_at DESC',
                            (sid,),
                        )
                        materials = [
                            {'id': r[0], 'title': r[1], 'description': r[2], 'fileUrl': r[3], 'createdAt': r[4].isoformat()}
                            for r in cur.fetchall()
                        ]
                        result.append({
                            'id': sid, 'fullName': s[1], 'kidName': s[2], 'phone': s[3], 'course': s[4],
                            'homework': homework, 'materials': materials,
                        })

                return {
                    'statusCode': 200,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'students': result}),
                }

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')

                if action == 'add-student':
                    full_name = (body.get('fullName') or '').strip()
                    kid_name = (body.get('kidName') or '').strip()
                    phone = (body.get('phone') or '').strip()
                    password = (body.get('password') or '').strip()
                    course = (body.get('course') or '').strip()

                    if not full_name or not phone or not password:
                        return {
                            'statusCode': 400,
                            'headers': {**cors, 'Content-Type': 'application/json'},
                            'body': json.dumps({'error': 'Укажите имя, телефон и пароль'}),
                        }

                    password_hash = hashlib.sha256(password.encode()).hexdigest()

                    with conn.cursor() as cur:
                        cur.execute(
                            f'INSERT INTO {schema}.students (full_name, kid_name, phone, password_hash, course) VALUES (%s, %s, %s, %s, %s) RETURNING id',
                            (full_name, kid_name, phone, password_hash, course),
                        )
                        new_id = cur.fetchone()[0]
                        conn.commit()

                    return {
                        'statusCode': 200,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps({'ok': True, 'id': new_id}),
                    }

                if action == 'add-homework':
                    student_id = body.get('studentId')
                    title = (body.get('title') or '').strip()
                    description = (body.get('description') or '').strip()
                    due_date = body.get('dueDate') or None

                    if not student_id or not title:
                        return {
                            'statusCode': 400,
                            'headers': {**cors, 'Content-Type': 'application/json'},
                            'body': json.dumps({'error': 'Укажите ученика и название задания'}),
                        }

                    with conn.cursor() as cur:
                        cur.execute(
                            f'INSERT INTO {schema}.student_homework (student_id, title, description, due_date) VALUES (%s, %s, %s, %s) RETURNING id',
                            (student_id, title, description, due_date),
                        )
                        new_id = cur.fetchone()[0]
                        conn.commit()

                    return {
                        'statusCode': 200,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps({'ok': True, 'id': new_id}),
                    }

                if action == 'add-material':
                    student_id = body.get('studentId')
                    title = (body.get('title') or '').strip()
                    description = (body.get('description') or '').strip()
                    file_url = (body.get('fileUrl') or '').strip()

                    if not student_id or not title:
                        return {
                            'statusCode': 400,
                            'headers': {**cors, 'Content-Type': 'application/json'},
                            'body': json.dumps({'error': 'Укажите ученика и название материала'}),
                        }

                    with conn.cursor() as cur:
                        cur.execute(
                            f'INSERT INTO {schema}.student_materials (student_id, title, description, file_url) VALUES (%s, %s, %s, %s) RETURNING id',
                            (student_id, title, description, file_url or None),
                        )
                        new_id = cur.fetchone()[0]
                        conn.commit()

                    return {
                        'statusCode': 200,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps({'ok': True, 'id': new_id}),
                    }

            return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            phone = (body.get('phone') or '').strip()
            password = (body.get('password') or '').strip()

            if not phone or not password:
                return {
                    'statusCode': 400,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Укажите телефон и пароль'}),
                }

            password_hash = hashlib.sha256(password.encode()).hexdigest()

            with conn.cursor() as cur:
                cur.execute(
                    f'SELECT id, full_name, kid_name, course FROM {schema}.students WHERE phone = %s AND password_hash = %s',
                    (phone, password_hash),
                )
                row = cur.fetchone()

                if not row:
                    return {
                        'statusCode': 401,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Неверный телефон или пароль'}),
                    }

                student_id, full_name, kid_name, course = row

                token = secrets.token_hex(32)
                expires_at = datetime.datetime.utcnow() + datetime.timedelta(days=30)

                cur.execute(
                    f'INSERT INTO {schema}.student_sessions (student_id, token, expires_at) VALUES (%s, %s, %s)',
                    (student_id, token, expires_at),
                )
                conn.commit()

            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'token': token,
                    'student': {
                        'id': student_id,
                        'fullName': full_name,
                        'kidName': kid_name,
                        'course': course,
                    },
                }),
            }

        if method == 'GET':
            token = headers.get('X-Session-Token') or headers.get('x-session-token')

            if not token:
                return {
                    'statusCode': 401,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Не указан токен сессии'}),
                }

            with conn.cursor() as cur:
                cur.execute(
                    f'''SELECT s.id, s.full_name, s.kid_name, s.course
                        FROM {schema}.student_sessions ss
                        JOIN {schema}.students s ON s.id = ss.student_id
                        WHERE ss.token = %s AND ss.expires_at > %s''',
                    (token, datetime.datetime.utcnow()),
                )
                row = cur.fetchone()

                if not row:
                    return {
                        'statusCode': 401,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Сессия истекла, войдите заново'}),
                    }

                student_id, full_name, kid_name, course = row

                cur.execute(
                    f'SELECT id, title, description, file_url, created_at FROM {schema}.student_materials WHERE student_id = %s ORDER BY created_at DESC',
                    (student_id,),
                )
                materials = [
                    {'id': r[0], 'title': r[1], 'description': r[2], 'fileUrl': r[3], 'createdAt': r[4].isoformat()}
                    for r in cur.fetchall()
                ]

                cur.execute(
                    f'SELECT id, title, description, due_date, status FROM {schema}.student_homework WHERE student_id = %s ORDER BY due_date ASC NULLS LAST',
                    (student_id,),
                )
                homework = [
                    {
                        'id': r[0],
                        'title': r[1],
                        'description': r[2],
                        'dueDate': r[3].isoformat() if r[3] else None,
                        'status': r[4],
                    }
                    for r in cur.fetchall()
                ]

            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'student': {
                        'id': student_id,
                        'fullName': full_name,
                        'kidName': kid_name,
                        'course': course,
                    },
                    'materials': materials,
                    'homework': homework,
                }),
            }

        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
    finally:
        conn.close()
