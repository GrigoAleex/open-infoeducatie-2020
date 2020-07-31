const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer()
const myVideo = document.createElement('video')
var participate = false
if(CAN_PARTICIPATE === "true")
  participate = true
console.log(participate)
myVideo.muted = true
const peers = {}
console.log(participate)
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  
  addVideoStream(myVideo, stream)
  if(participate === true){
    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })
    document.getElementById('links').append( "STREAMINK ID: " + STREAMING_URL )
  }
  
  
  socket.on('user-connected', userId => {
    if(participate === true)
      connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (participate === true) {
    if (peers[userId]) peers[userId].close()
    document.getElementById(userId).remove()
  }
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