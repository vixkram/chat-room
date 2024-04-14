var socket = io();

function joinRoom() {
    var name = document.getElementById('nameInput').value.trim(); // Trim whitespace
    if (name === "") {
        alert("Please enter your name.");
        return; // Exit the function if name is empty
    }
    socket.emit('join', {name: name});
    document.getElementById('joinForm').style.display = 'none';
    document.getElementById('chatRoom').style.display = 'block';
    document.getElementById('messageInputContainer').style.display = 'flex';
}

function sendMessage() {
    var message = document.getElementById('messageInput').value;
    var name = document.getElementById('nameInput').value;
    socket.emit('message', {name: name, message: message});
    document.getElementById('messageInput').value = '';
}

socket.on('join_message', function(data) {
    var li = document.createElement('li');
    li.className = 'glow';
    li.appendChild(document.createTextNode(data.name + ' joined the room.'));
    document.getElementById('messages').appendChild(li);
    scrollToBottom();
});

socket.on('leave_message', function(data) {
    var li = document.createElement('li');
    li.className = 'glow';
    li.appendChild(document.createTextNode(data.name + ' left the room.'));
    document.getElementById('messages').appendChild(li);
    scrollToBottom();
});

socket.on('message', function(data) {
    var li = document.createElement('li');
    li.innerHTML = '<span class="username">' + data.name + ':</span> ' + data.message;
    document.getElementById('messages').appendChild(li);
    scrollToBottom();
});

function scrollToBottom() {
    var messagesContainer = document.getElementById('chatRoom');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

document.getElementById('messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) { // Add condition to prevent execution when Shift+Enter is pressed
        event.preventDefault(); // Prevent default behavior (i.e., inserting a new line)
        sendMessage();
    }
});