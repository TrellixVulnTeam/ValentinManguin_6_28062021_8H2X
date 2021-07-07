const http =  require('http');      // Import du package http 
const app =   require('./app');    // Import de app


const normalizePort = require('normalize-port');
 
const port = normalizePort(process.env.PORT || '3000');

const server = http.createServer(app).listen(port, () => {
    console.log(`listening on ${port}`)
  })
 




// server.listen(port); 












