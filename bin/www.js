const http = require('http')
const serverHandle = require('../app')
const server = http.createServer(serverHandle)
const PORT = 1996
server.listen(PORT)