import json
import os
import urllib.request


def handler(event: dict, context) -> dict:
    '''
    Принимает заявку с сайта студии Kasalia и отправляет её на почту через Resend.
    Args: event с httpMethod, body (name, phone, comment); context с request_id.
    Returns: HTTP-ответ со статусом отправки заявки.
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**cors, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    name = (body.get('name') or '').strip()
    phone = (body.get('phone') or '').strip()
    comment = (body.get('comment') or '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите имя и телефон'}),
        }

    api_key = os.environ.get('RESEND_API_KEY')
    to_email = os.environ.get('NOTIFY_EMAIL')

    html = (
        f'<h2>Новая заявка с сайта Kasalia 🎈</h2>'
        f'<p><b>Имя:</b> {name}</p>'
        f'<p><b>Телефон:</b> {phone}</p>'
        f'<p><b>Комментарий:</b> {comment or "—"}</p>'
    )

    payload = json.dumps({
        'from': 'Kasalia <onboarding@resend.dev>',
        'to': [to_email],
        'subject': f'Новая заявка: {name}',
        'html': html,
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.resend.com/emails',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    with urllib.request.urlopen(req) as resp:
        resp.read()

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True}),
    }
