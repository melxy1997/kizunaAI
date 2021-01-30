const exec = require('child_process').exec;
const express = require('express')
let server = express()
server.listen(5678)

let processFlag = 0

server.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3333');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

server.get('/getFlag', (req, res, next) => {
    res.send({'value': processFlag })
    next()
})

server.get('/setFlag', (req, res, next) => {
    res.send({'value': processFlag })
    next()
})

server.post('/upLoad', (req, res, next) => {
    /* 保存文件 & 返回文件路径videoFilePath */
    exec('python ./vtuber_link_start.py ${videoFilePath}')
    processFlag = 1 //设为开始推断，其实为时过早
    next()
})

server.post('/saveBlob', (req, res, next) => {
    //kizuna.html调用
    res.header("Access-Control-Allow-Origin", 'http://localhost:6789');
    /* 保存文件 & 返回文件路径gifFilePath */
    next()
})

server.get('/getGifURL', (req, res, next) => {
    //小程序调用
    /* 访问数据库 */
    res.send({'URL': URL })
    processFlag =  0 //设为空闲，其实为时过早
    next()
})

console.log("Listening http://localhost:5678/");

/*
const http = require('http')
const io = require('socket.io')
const exec = require('child_process').exec;
let server = http.createServer((req, res)=>{
    //处理文件上传
    const videoFilePath = 'DIR_NAME/' + res.fileName
    //将文件名作为参数，执行python文件
    exec('python ./vtuber_link_start.py ${videoFilePath}')
    res.write({msg:'上传完毕，开始推断'})
    res.end()
})
server.listen(5678)
*/

/*
const exec = require('child_process').exec;
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
*/