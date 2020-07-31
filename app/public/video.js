const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer()
const myVideo = document.createElement('video')


const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  
  addVideoStream(myVideo, stream)
    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })


  
  
  socket.on('user-connected', userId => {
      connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
    document.getElementById(userId).remove()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, userId)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream, userId) {
  video.srcObject = stream
  video.id = userId
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}