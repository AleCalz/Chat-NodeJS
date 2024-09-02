import express from 'express'
import logger from 'morgan'

const port = process.env.PORT || 3000
const app = express()

//morgan es libreria que funciona a nivel de express para registrar las peticiones(logger)
app.use(logger('dev')) //logger que se utilizara para modo desarrollo


app.get('/', (req, res) => {
  //sendFile es una funcion de express que se utiliza para servir archivos, en este caso el index.html
  //process.cwd() cwd - currentWorkingDirectory, es una funcion de node que devuelve la ruta de la carpeta actual
  res.sendFile(process.cwd() + '/client/index.html')
})




app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
