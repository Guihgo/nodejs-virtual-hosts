let http = require('http')
let express = require('express')
let app = express()
let server = http.createServer(app)

let port = process.argv[2] || 80;
server.listen(port)
console.log('Servidor http rodando na porta', port)

let httpProxy = require('http-proxy')
let proxy = httpProxy.createProxyServer({})
let virtualHosts = require('./virtualHosts')

app.use((req, res, next) => {
    console.log('passou por aqui', req.hostname)
    let vHost = null;
    for (let i = 0; i < virtualHosts.length; i++) {
        console.log(virtualHosts[i])
        if (virtualHosts[i].hostnames.find(hostname => hostname == req.hostname)) {
            console.log('achou', req.hostname);
            // res.redirect('http://127.0.0.1:3001')
            return proxy.web(req, res, { target: virtualHosts[i].target });
        }
    }
    return next()

})
app.get('/', (req, res) => {
    return res.send('Hostname não encontrado')
})
