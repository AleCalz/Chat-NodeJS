import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'

import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { createClient } from '@libsql/client'

dotenv.config()

const port = process.env.PORT || 3000
const app = express()

//creamos nuestro server para poder utilizar todas las funciones de socket.io
const server = createServer(app)
//in out = io
const io = new Server(server, {
  //TODO
  connectionStateRecovery: {}
})

//conexion a db libsql/turso
const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_AUTH_TOKEN
})

//creamos la tabla si no existe
await db.execute(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL
  )`)

//cuando el io tenga una conexion se ejecutará este callback
io.on('connection', (socket) => {
  console.log('user conected!')

  socket.on('disconnect', () => {
    console.log('user disconnected!')
  })

  //cuando un socket de una especifica conexion reciba el evento chatMessage ejecuta el callback
  //del cliente al serv para enviar el mensaje
  socket.on('chatMessage', (message) => {
    console.log(`msg socket: ${message}`)

    //broadcast io.emit
    //es un evento que se emite a todos los sockets conectados
    //emitimos chatmessage a todo mundo
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
