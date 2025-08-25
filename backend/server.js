const WebSocket = require('ws')
const https = require('https')
const fs = require('fs')

const options = {
  cert: fs.readFileSync(
    process.env.WS_CERT || '/app/certs/STAR_uap_edu_ar.crt'
  ),
  key: fs.readFileSync(process.env.WS_KEY || '/app/certs/uap.edu.ar.key'),
  ca: fs.readFileSync(process.env.WS_CA || '/app/certs/CAbundle.crt'),
}

const server = https.createServer(options)
const wss = new WebSocket.Server({ server, maxPayload: 1024 * 1024 })

// Track connected clients per room
const rooms = new Map()

const MESSAGE_TYPE = {
  INITIAL_DATA: 'INITIAL_DATA',
  SEND_MESSAGE: 'SEND_MESSAGE',
  NEW_MESSAGE: 'NEW_MESSAGE',
}

wss.on('connection', (ws, req) => {
  const chatId = req.url.split('/')[1]
  console.log(`Client connected. Room ID: ${chatId}`)

  // Register client in the room
  if (!rooms.has(chatId)) {
    rooms.set(chatId, new Set())
  }
  rooms.get(chatId).add(ws)

  // Assign the chatId to the WebSocket connection
  ws.chatId = chatId

  // Heartbeat to detect dead connections
  ws.isAlive = true
  ws.on('pong', () => {
    ws.isAlive = true
  })

  ws.on('message', (message) => {
    let data
    try {
      data = JSON.parse(message)
    } catch (err) {
      console.warn('Invalid JSON received, ignoring message')
      return
    }

    if (data.type === MESSAGE_TYPE.SEND_MESSAGE) {
      const { payload } = data

      // Send the new message to all clients in the same room
      const clientsInRoom = rooms.get(chatId)
      if (clientsInRoom) {
        clientsInRoom.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: MESSAGE_TYPE.NEW_MESSAGE,
                payload,
              })
            )
          }
        })
      }
    }
  })

  ws.on('error', (err) => {
    console.error(`WebSocket error in room ${chatId}:`, err)
  })

  ws.on('close', () => {
    const clientsInRoom = rooms.get(chatId)
    if (clientsInRoom) {
      clientsInRoom.delete(ws)
      if (clientsInRoom.size === 0) {
        rooms.delete(chatId)
      }
    }
    console.log(`Client disconnected from room ${chatId}`)
  })
})

// Heartbeat interval for all clients
const interval = setInterval(() => {
  wss.clients.forEach((socket) => {
    if (socket.isAlive === false) {
      return socket.terminate()
    }
    socket.isAlive = false
    try {
      socket.ping()
    } catch (e) {
      // ignore
    }
  })
}, 30000)

wss.on('close', () => {
  clearInterval(interval)
})

const port = process.env.WS_PORT || 3001
server.listen(port, () => {
  console.log(`Secure WebSocket server is running on port ${port}`)
})
