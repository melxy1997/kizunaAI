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

const http = require('http');
const url = require('url');
const querystring = require('querystring');

http.createServer(function (req,res){

    //暂存请求体信息
    var body = "";
 
    //请求链接
    console.log(req.url);
 
    //每当接收到请求体数据，累加到post中
    req.on('data', function (chunk) {
        body += chunk;  //一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
        console.log("chunk:",chunk);
    });
 
    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function () {
        // 解析参数
        body = querystring.parse(body);  //将一个字符串反序列化为一个对象
        console.log("body:",body);

        // 设置响应头部信息及编码
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
        var data = {"code":200, "msg":"success", "token":"token_" + body.username + "_" + body.password};
        res.end(JSON.stringify(data));
    });
    
}).listen(7890);
