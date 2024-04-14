from flask import Flask, render_template, request
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# List to store chat messages
chat_history = []

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def handle_join(data):
    name = data['name']
    # Send chat history to the new user
    for message in chat_history:
        socketio.emit('message', message)
    socketio.emit('join_message', {'name': name})

@socketio.on('leave')
def handle_leave():
    name = clients[request.sid]
    socketio.emit('leave_message', {'name': name})

@socketio.on('message')
def handle_message(data):
    name = data['name']
    message = data['message']
    chat_history.append({'name': name, 'message': message})
    socketio.emit('message', {'name': name, 'message': message})

if __name__ == '__main__':
    socketio.run(app, debug=True)
