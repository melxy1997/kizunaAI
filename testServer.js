let app = require('http').createServer(handler)
let fs = require('fs');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
// 异步执行

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


app.listen(5678, () => {
    console.log('listening on 5678')

    exec('python ./vtuber_link_start.py')

    console.log('over')
});
