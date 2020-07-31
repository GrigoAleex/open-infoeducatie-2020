const chatSocket = io('/')
const messageContainer = document.getElementById('message-container')
const submit = document.getElementById('send-button')
const messageInput = document.getElementById('message-input')
const name = prompt('Cum te cheama?')

appendMessage('Te-ai connectat!')
chatSocket.emit('new-user', ROOM_ID, name)

chatSocket.on('chat-message', data => {
    if( data.room === ROOM_ID )
        appendMessage(`${data.name}: ${data.message}`)
})

chatSocket.on('user-connected', user => {
    if(user.room === ROOM_ID)
  appendMessage(`${user.name} s-a connectat!`)
})

chatSocket.on('user-disconnected', user => {
    if( user.room === ROOM_ID )
        appendMessage(`${user.name} s-a deconectat!`)
})

console.log('Client-side code running');
submit.addEventListener('click', function(e) {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    chatSocket.emit('send-chat-message', message)
    messageInput.value = ''
});

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}