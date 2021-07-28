const http =  require('http');      // Import du package http 
const app =   require('./app');    // Import de app


// Ajout d'un port de connexion valide 

const normalizePort = require('normalize-port');
 
const port = normalizePort(process.env.PORT || '3000');


// Permet de gerer les appels serveur (requetes et reponses)

const server = http.createServer(app).listen(port, () => {
    console.log(`listening on ${port}`)
  })
 

















