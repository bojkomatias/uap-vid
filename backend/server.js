// Import WebSocket and HTTP libraries
const WebSocket = require('ws')
const http = require('http')

// Create an HTTP server and a WebSocket server on top of it
const server = http.createServer()
const wss = new WebSocket.Server({ server })

// Initialize an array to store chat messages
let chatMessages = []
const MESSAGE_TYPE = {
  INITIAL_DATA: 'INITIAL_DATA',
  SEND_MESSAGE: 'SEND_MESSAGE',
  NEW_MESSAGE: 'NEW_MESSAGE',
}

// Listen for new WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected.')

  // Send the initial chat messages to the newly connected client
  ws.send(
    JSON.stringify({
      type: MESSAGE_TYPE.INITIAL_DATA,
      payload: chatMessages,
    })
  )

  // Listen for incoming messages from the client
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message)
    if (parsedMessage.type === MESSAGE_TYPE.SEND_MESSAGE) {
      const { content } = JSON.parse(parsedMessage.content)
      chatMessages.push(content)
      console.log(chatMessages)
      // Iterate through all connected clients and send the new message to them
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
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

  // Listen for the 'close' event to log when a client disconnects
  ws.on('close', () => {
    console.log('Client disconnected.')
  })
})

// Start the server and listen on a specific port
const port = process.env.NEXT_PUBLIC_WEBSOCKET_PORT || 3001
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
