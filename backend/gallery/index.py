import json
import os
import base64
import uuid
import psycopg2
import boto3


def handler(event: dict, context) -> dict:
    '''
    Галерея фото и видео с занятий клуба Kasalia.
    GET — публичный список медиа (доступен всем, без авторизации).
    POST/DELETE — добавление и удаление медиа, требуют заголовок X-Admin-Password с верным паролем.
    Загрузка файла: POST с полями fileData (base64), fileName, mediaType ('photo'|'video'), caption — файл кладётся в S3, ссылка сохраняется в БД.
    Args: event с httpMethod, headers, body, queryStringParameters; context с request_id.
    Returns: HTTP-ответ со списком медиа или результатом операции.
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**cors, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = event.get('headers', {})
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    def check_admin():
        password = headers.get('X-Admin-Password') or headers.get('x-admin-password')
        expected = os.environ.get('ADMIN_TOKEN')
        return expected and password == expected

    try:
        if method == 'GET':
            with conn.cursor() as cur:
                cur.execute(
                    f'SELECT id, media_type, url, caption, sort_order, created_at FROM {schema}.gallery_items ORDER BY sort_order ASC, created_at DESC'
                )
                rows = cur.fetchall()
                items = [
                    {
                        'id': r[0], 'mediaType': r[1], 'url': r[2], 'caption': r[3],
                        'sortOrder': r[4], 'createdAt': r[5].isoformat(),
                    }
                    for r in rows
                ]
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'items': items}),
            }

        if not check_admin():
            return {
                'statusCode': 403,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Неверный пароль'}),
            }

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            media_type = (body.get('mediaType') or 'photo').strip()
            caption = (body.get('caption') or '').strip()
            file_data = body.get('fileData')
            file_name = (body.get('fileName') or '').strip()
            url = (body.get('url') or '').strip()

            if media_type not in ('photo', 'video'):
                return {
                    'statusCode': 400,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Тип медиа может быть только photo или video'}),
                }

            if file_data and file_name:
                if ',' in file_data:
                    file_data = file_data.split(',', 1)[1]
                raw = base64.b64decode(file_data)
                ext = file_name.rsplit('.', 1)[-1].lower() if '.' in file_name else 'jpg'
                key = f'gallery/{uuid.uuid4()}.{ext}'

                content_types = {
                    'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
                    'webp': 'image/webp', 'gif': 'image/gif',
                    'mp4': 'video/mp4', 'mov': 'video/quicktime', 'webm': 'video/webm',
                }
                content_type = content_types.get(ext, 'application/octet-stream')

                s3 = boto3.client(
                    's3',
                    endpoint_url='https://bucket.poehali.dev',
                    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
                )
                s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)
                url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

            if not url:
                return {
                    'statusCode': 400,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Не передан файл или ссылка на медиа'}),
                }

            with conn.cursor() as cur:
                cur.execute(
                    f'INSERT INTO {schema}.gallery_items (media_type, url, caption) VALUES (%s, %s, %s) RETURNING id',
                    (media_type, url, caption),
                )
                new_id = cur.fetchone()[0]
                conn.commit()

            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True, 'id': new_id, 'url': url}),
            }

        if method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            item_id = params.get('id')
            if not item_id:
                return {
                    'statusCode': 400,
                    'headers': {**cors, 'Content-Type': 'application/json'},
                    'body': json.dumps({'error': 'Не указан id'}),
                }
            with conn.cursor() as cur:
                cur.execute(f'DELETE FROM {schema}.gallery_items WHERE id = %s', (item_id,))
                conn.commit()
            return {
                'statusCode': 200,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True}),
            }

        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}
    finally:
        conn.close()
