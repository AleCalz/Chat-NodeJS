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
io.on('connection', async (socket) => {
  console.log('user conected!')

  socket.on('disconnect', () => {
    console.log('user disconnected!')
  })

  //CLIENTE -> SERVER
  //cuando un socket de una especifica conexion reciba el evento chatMessage ejecuta el callback
  socket.on('chatMessage', async (message) => {
    let result
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (message) VALUES (:message)',
        args: { message }
      })
    } catch (e) {
      console.error(e)
      return
    }
    console.log(`msg socket: ${message}`)

    //broadcast io.emit
    //es un evento que se emite a todos los sockets conectados
    //emitimos chatmessage a todo mundo
    //junto con el id de la ultima fila insertada (el ultimo mensaje = offset)
    io.emit('chatMessage', message, result.lastInsertRowid.toString())
  })

  console.log(socket.handshake.auth)

  if (!socket.recovered) {
    //recuperar los mensajes sin conexion
    //si se conecta un nuevo cliente yno se recupera la desconexion
    try {
      const results = await db.execute({
        sql: 'SELECT id, message FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach((row) => {
        socket.emit('chatMessage', row.message, row.id.toString())
      })
    } catch (e) {
      console.error(e)
    }
  }
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
