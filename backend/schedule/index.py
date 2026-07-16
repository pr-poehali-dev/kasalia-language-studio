import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Управляет расписанием занятий студии Kasalia.
    Args: event с httpMethod (GET доступен всем, POST/PUT/DELETE требуют X-Admin-Token), body, queryStringParameters; context с request_id.
    Returns: HTTP-ответ со списком занятий или результатом изменения.
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**cors, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    try:
        if method == 'GET':
            with conn.cursor() as cur:
                cur.execute(
                    f'SELECT id, days, time_range, course, color, sort_order FROM {schema}.schedule WHERE sort_order >= 0 ORDER BY sort_order ASC'
                )
                rows = cur.fetchall()
                items = [
                    {'id': r[0], 'days': r[1], 'time': r[2], 'course': r[3], 'color': r[4], 'sortOrder': r[5]}
                    for r in rows
                ]
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'items': items}),
            }

        admin_token = event.get('headers', {}).get('X-Admin-Token') or event.get('headers', {}).get('x-admin-token')
        expected_token = os.environ.get('ADMIN_TOKEN')
        if not expected_token or admin_token != expected_token:
            return {
                'statusCode': 403,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Доступ запрещён'}),
            }

        body = json.loads(event.get('body') or '{}')

        if method == 'POST':
            days = (body.get('days') or '').strip()
            time_range = (body.get('time') or '').strip()
            course = (body.get('course') or '').strip()
            color = (body.get('color') or 'text-primary').strip()
            sort_order = int(body.get('sortOrder') or 0)

            if not days or not time_range or not course:
                return {
                    'statusCode': 400,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Заполните дни, время и курс'}),
                }

            with conn.cursor() as cur:
                cur.execute(
                    f'INSERT INTO {schema}.schedule (days, time_range, course, color, sort_order) VALUES (%s, %s, %s, %s, %s) RETURNING id',
                    (days, time_range, course, color, sort_order),
                )
                new_id = cur.fetchone()[0]
                conn.commit()
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'id': new_id}),
            }

        if method == 'PUT':
            item_id = body.get('id')
            if not item_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Не указан id'}),
                }
            days = (body.get('days') or '').strip()
            time_range = (body.get('time') or '').strip()
            course = (body.get('course') or '').strip()
            color = (body.get('color') or 'text-primary').strip()
            sort_order = int(body.get('sortOrder') or 0)

            with conn.cursor() as cur:
                cur.execute(
                    f'UPDATE {schema}.schedule SET days = %s, time_range = %s, course = %s, color = %s, sort_order = %s, updated_at = now() WHERE id = %s',
                    (days, time_range, course, color, sort_order, item_id),
                )
                conn.commit()
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True}),
            }

        if method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            item_id = params.get('id') or body.get('id')
            if not item_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Не указан id'}),
                }
            with conn.cursor() as cur:
                cur.execute(f'DELETE FROM {schema}.schedule WHERE id = %s', (item_id,))
                conn.commit()
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True}),
            }

        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
    finally:
        conn.close()