document.addEventListener('DOMContentLoaded', function() {
    const socket = io();

    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const messageContent = messageInput.value.trim();
        if (messageContent !== '') {
            const data = {
                'username': 'Guest',
                'content': messageContent,
                'timestamp': getFormattedTimestamp(new Date())
            };
            socket.emit('send_message', data);
            messageInput.value = '';
        }
    }

    function getFormattedTimestamp(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const amPm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${amPm}`;
    }

    socket.on('connect', function() {
        console.log('Connected to server');
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });

    socket.on('receive_message', function(data) {
        appendMessage(data);
    });

    function loadAndShowImage(link) {
        const imageElement = document.createElement('img');
        imageElement.src = link;
        imageElement.className = 'message-image';
        return imageElement;
    }
    
    function appendMessage(data) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${data.username === 'Guest' ? 'self' : 'other'}`;
    
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
    
        const linkRegex = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
        const contentWithLinks = data.content.replace(linkRegex, (_, link) => {
            if (/\.(jpe?g|png|gif|bmp|webp)$/i.test(link)) {
                return `<div class="message-image-container"><img class="message-image" src="${link}" alt="Imagen"></div>`;
            } else {
                return `<a href="${link}" target="_blank" style="color: blue;">${link}</a>`;
            }
        });
    
        messageContent.innerHTML = contentWithLinks;
    
        const messageTimestamp = document.createElement('span');
        messageTimestamp.className = 'message-timestamp';
        messageTimestamp.innerText = ` ${data.timestamp}`;
    
        messageElement.appendChild(messageContent);
        messageElement.appendChild(messageTimestamp);
    
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
});