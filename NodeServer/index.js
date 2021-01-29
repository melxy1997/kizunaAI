var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

function handler(req, res) {
    fs.readFile(__dirname + req.url,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

io.of('/kizuna').on('connection', (socket) => {
    console.log('a kizuna client connected');
    let counter = 0
    socket.on('result_data', (result) => {
        if (result != 0) {
            counter+=1
            console.log('NodeServer: receive', counter);
            // if(counter==30){ counter=0 }
            socket.broadcast.emit('result_download', result);
        }
    });

    socket.on('disconnect', () => { console.log('a kizuna client disconnected') });
});

app.listen(6789, () => console.log('listening on http://127.0.0.1:6789/kizuna.html'));
