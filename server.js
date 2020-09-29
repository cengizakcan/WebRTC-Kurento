const express = require('express');
const https = require('https');
const fs = require('fs');
const router = require(__dirname + '/routes/index.js');
const port = process.env.PORT || 8443;
const kurento = require('kurento-client');
const minimist = require('minimist');

const kurentoClient = null;

const app = express();

const server = https.createServer({
    key: fs.readFileSync('ssl/localhost_private.key'),
    cert: fs.readFileSync('ssl/localhost.crt')
}, app);

const io = require('socket.io')(server);

server.listen(port, (req, res) => {
    console.log('Server starts!');
});

const argv = minimist(process.argv.slice(2), {
    default: {
        as_uri: 'https://localhost:8443/',
        ws_uri: 'ws://localhost:8888/kurento'
    }
})

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use('/', router);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function getKurentoClient(callback) {
    if (kurentoClient !== null) {
        return callback(null, kurentoClient);
    }

    kurento(argv.ws_uri, (error, _kurentoClient) => {
        if (error) {
            console.log("Could not find media server at address " + argv.ws_uri);
            return callback("Could not find media server at address" + argv.ws_uri
                    + ". Exiting with error " + error);
        }

        kurentoClient = _kurentoClient;
        callback(null, kurentoClient);
    });
}