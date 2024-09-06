# Chat con Usuarios Aleatorios

Chat en tiempo real entre usuarios aleatorios

## Características

- Conexión aleatoria entre usuarios.
- **Chat en tiempo real**: Los mensajes se transmiten instantáneamente entre los usuarios emparejados gracias a la integración con **Socket.IO**, asegurando una comunicación fluida y sin retrasos.
- **Simplicidad y anonimato**: No se requiere autenticación ni creación de cuentas. El objetivo es facilitar conversaciones rápidas y anónimas entre dos personas en el momento en que ambas se conectan.

## Tecnologías

- **Node.js**: Plataforma para construir el servidor backend.
- **Socket.IO**: Biblioteca para implementar websockets y manejo de eventos en tiempo real.
- **Morgan**: Middleware de registro de peticiones HTTP.
- **dotenv**: Para cargar variables de entorno desde un archivo `.env`.
- **Turso**: Base de datos serverless utilizada para almacenar información.
- **libsql/client**: Cliente utilizado para interactuar con la base de datos.

## Instalación

1. Clona este repositorio:
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    ```

2. Instala las dependencias:
    ```bash
    cd tu-repositorio
    npm install
    ```

3. Crea un archivo `.env` con las siguientes variables de entorno:
    ```
    DATABASE_URL=<tu-url-de-turso>
    DATABASE_TOKEN=<tu-token-de-turso>
    ```

4. Inicia el servidor:
    ```bash
    npm start
    ```

## Uso

1. Abre la aplicación en tu navegador accediendo a `http://localhost:3000`.
2. Para probar el emparejamiento aleatorio y la persistencia de datos:
    - Abre la aplicación en dos navegadores o en dos pestañas diferentes.
    - Cada instancia del navegador actuará como un usuario independiente, permitiendo que te conectes y chatees aleatoriamente con el otro usuario.
3. Los mensajes intercambiados se persisten en la base de datos utilizando **Turso**, por lo que si recargas o desconectas y reconectas un usuario, el chat puede continuar con otro usuario disponible.

