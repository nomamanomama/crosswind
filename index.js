const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
   
    .get('/', (req, res) =>res.sendFile(path.join(__dirname,'/views/index.html')))
    .get('/about', (req, res) => res.sendFile(path.join(__dirname,'/views/about.html'))) 
    .use(express.static(path.join(__dirname, '/views')))
    .listen(PORT, ()=> console.log(`Listening on ${ PORT }` ))