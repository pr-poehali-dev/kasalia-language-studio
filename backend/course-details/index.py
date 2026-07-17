import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Возвращает подробную информацию о курсе студии Kasalia: описание, преподавателя и фотогалерею.
    Args: event с httpMethod, queryStringParameters (slug); context с request_id.
    Returns: HTTP-ответ с деталями курса и списком фото.
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**cors, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    if method != 'GET':
        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

    params = event.get('queryStringParameters') or {}
    slug = params.get('slug')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    try:
        with conn.cursor() as cur:
            if slug:
                cur.execute(
                    f'SELECT slug, lang, full_description, teacher_name, teacher_role, teacher_photo FROM {schema}.course_details WHERE slug = %s',
                    (slug,),
                )
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps({'error': 'Курс не найден'}),
                    }

                cur.execute(
                    f'SELECT photo_url FROM {schema}.course_photos WHERE course_slug = %s ORDER BY sort_order ASC',
                    (slug,),
                )
                photos = [r[0] for r in cur.fetchall()]

                course = {
                    'slug': row[0],
                    'lang': row[1],
                    'fullDescription': row[2],
                    'teacherName': row[3],
                    'teacherRole': row[4],
                    'teacherPhoto': row[5],
                    'photos': photos,
                }
                return {
                    'statusCode': 200,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'course': course}),
                }

            cur.execute(f'SELECT slug, lang, full_description, teacher_name, teacher_role, teacher_photo FROM {schema}.course_details')
            rows = cur.fetchall()
            courses = [
                {
                    'slug': r[0],
                    'lang': r[1],
                    'fullDescription': r[2],
                    'teacherName': r[3],
                    'teacherRole': r[4],
                    'teacherPhoto': r[5],
                }
                for r in rows
            ]
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'courses': courses}),
        }
    finally:
        conn.close()
