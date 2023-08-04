from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

def get_username():
    return 'John Doe'

@socketio.on('send_message')
def handle_message(data):
    username = get_username()
    message = {
        'username': username,
        'content': data['content'],
        'timestamp': data['timestamp'],
        'ip': request.remote_addr
    }
    emit('receive_message', message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)