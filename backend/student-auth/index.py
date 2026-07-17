import json
import os
import hashlib
import secrets
import datetime
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Кабинет ученика студии Kasalia: вход по телефону+паролю (POST) и получение
    материалов/заданий по токену сессии (GET).
    Args: event с httpMethod, body (phone, password) для POST, headers (X-Session-Token) для GET; context с request_id.
    Returns: HTTP-ответ с токеном и данными ученика (POST) или материалами/заданиями (GET).
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**cors, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    try:
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
            headers = event.get('headers', {})
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
