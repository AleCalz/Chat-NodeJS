import express from 'express'
import logger from 'morgan'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT || 3000
const app = express()

//creamos nuestro server para poder utilizar todas las funciones de socket.io
const server = createServer(app)
//in out = io
const io = new Server(server)
//cuando el io tenga una conexion se ejecutará este callback
io.on('connection', (socket) => {
  console.log('user conected!')

  socket.on('disconnect', () => {
    console.log('user disconnected!')
  })

  //cuando un socket de una especifica conexion reciba el evento chatMessage ejecuta el callback
  socket.on('chatMessage', (message) => {
    console.log(message)
    io.emit('chatMessage', message)
  })
})

//morgan es libreria que funciona a nivel de express para registrar las peticiones(logger)
app.use(logger('dev')) //logger que se utilizara para modo desarrollo

app.get('/', (req, res) => {
  //sendFile es una funcion de express que se utiliza para servir archivos, en este caso el index.html
  //process.cwd() cwd - currentWorkingDirectory, es una funcion de node que devuelve la ruta de la carpeta actual
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
