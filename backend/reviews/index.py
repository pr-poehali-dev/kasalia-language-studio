import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    '''
    Управляет отзывами родителей студии Kasalia.
    Args: event с httpMethod (GET — список одобренных отзывов, POST — родитель оставляет отзыв на модерацию); context с request_id.
    Returns: HTTP-ответ со списком отзывов или результатом отправки.
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**cors, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    try:
        if method == 'GET':
            with conn.cursor() as cur:
                cur.execute(
                    f'SELECT id, name, kid, text, stars FROM {schema}.reviews WHERE approved = true ORDER BY created_at DESC'
                )
                rows = cur.fetchall()
                items = [
                    {'id': r[0], 'name': r[1], 'kid': r[2], 'text': r[3], 'stars': r[4]}
                    for r in rows
                ]
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'items': items}),
            }

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            name = (body.get('name') or '').strip()
            kid = (body.get('kid') or '').strip()
            text = (body.get('text') or '').strip()
            stars = int(body.get('stars') or 5)

            if not name or not text:
                return {
                    'statusCode': 400,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Заполните имя и текст отзыва'}),
                }

            stars = max(1, min(5, stars))

            with conn.cursor() as cur:
                cur.execute(
                    f'INSERT INTO {schema}.reviews (name, kid, text, stars, approved) VALUES (%s, %s, %s, %s, false) RETURNING id',
                    (name, kid, text, stars),
                )
                new_id = cur.fetchone()[0]
                conn.commit()
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'id': new_id, 'message': 'Спасибо! Отзыв появится после проверки.'}),
            }

        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
    finally:
        conn.close()
