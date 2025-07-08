import eventlet
eventlet.monkey_patch()

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'uma_chave_secreta_muito_segura'

socketio = SocketIO(app, cors_allowed_origins="*")

documents = {}

@socketio.on('connect')
def handle_connect():
    print(f'Cliente conectado: {request.sid}')

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Cliente desconectado: {request.sid}')

@socketio.on('joinDocument')
def handle_join_document(document_id):
    join_room(document_id)
    print(f'Cliente {request.sid} se juntou ao documento {document_id}')

    if document_id in documents:
        emit('documentChanged', {'documentId': document_id, 'content': documents[document_id]}, room=request.sid)
    else:
        documents[document_id] = ''

@socketio.on('documentUpdate')
def handle_document_update(data):
    document_id = data.get('documentId')
    content = data.get('content')

    if document_id and content is not None:
        print(f'Atualização do documento {document_id} de {request.sid}: {content[:50]}...')

        documents[document_id] = content

        emit('documentChanged', {'documentId': document_id, 'content': content}, room=document_id, skip_sid=request.sid)
    else:
        print(f"Dados de atualização inválidos recebidos de {request.sid}: {data}")

@app.route('/')
def index():
    return "Servidor de Colaboração em Tempo Real rodando!"

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=3000, debug=True)