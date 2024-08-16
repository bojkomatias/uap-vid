const WebSocket = require('ws')
const https = require('https')
const fs = require('fs')

const options = {
  cert: fs.readFileSync('/app/certs/STAR_uap_edu_ar.crt'),
  key: fs.readFileSync('/app/certs/uap.edu.ar.key'),
  ca: fs.readFileSync('/app/certs/CAbundle.crt'),
}

const server = https.createServer(options)
const wss = new WebSocket.Server({ server })

// Initialize an object to store chat messages for each room
let chatRooms = {}

const MESSAGE_TYPE = {
  INITIAL_DATA: 'INITIAL_DATA',
  SEND_MESSAGE: 'SEND_MESSAGE',
  NEW_MESSAGE: 'NEW_MESSAGE',
}

wss.on('connection', (ws, req) => {
  const chatId = req.url.split('/')[1]
  console.log(`Client connected. Room ID: ${chatId}`)

  // Initialize the chat room if it doesn't exist
  if (!chatRooms[chatId]) {
    chatRooms[chatId] = []
  }

  // Send the initial chat messages for this room to the newly connected client
  ws.send(
    JSON.stringify({
      type: MESSAGE_TYPE.INITIAL_DATA,
      payload: chatRooms[chatId],
    })
  )

  // Assign the chatId to the WebSocket connection
  ws.chatId = chatId

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage.type === MESSAGE_TYPE.SEND_MESSAGE) {
      const { content } = JSON.parse(parsedMessage.content)

      // Add the new message to the room's message history
      chatRooms[chatId].push(content)
      console.log(`New message in room ${chatId}:`, content)

      // Send the new message to all clients in the same room
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.chatId === chatId) {
          client.send(
            JSON.stringify({
              type: MESSAGE_TYPE.NEW_MESSAGE,
              payload: content,
            })
          )
        }
      })
    }
  })

  ws.on('close', () => {
    console.log(`Client disconnected from room ${chatId}`)
  })
})

const port = 3001
server.listen(port, () => {
  console.log(`Secure WebSocket server is running on port ${port}`)
})
