const exec = require('child_process').exec;
const express = require('express');
const fs = require("fs");
const bodyParser = require('body-parser'); 
const multer  = require('multer');

// 占位函数构成的临时服务器，只可演示参考
// 假设只有一个用户且文件名不冲突；多用户需要在小程序部分增加用户标记或实现注册用户管理

const server = express()
server.listen(5678)
server.use(bodyParser.urlencoded({ extended: false }));
server.use(multer({ dest: '/tmp/'}).array('file'));

let processFlag = 0
let gifURL = ''

server.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3333');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

server.use(express.static("./public"));

server.get('/getFlag', (req, res, next) => {
    res.send({'value': processFlag })
    next()
})

server.get('/setFlag', (req, res, next) => {
    processFlag = parseInt(req.query.value)
    res.send({'value': processFlag })
    next()
})

server.post('/upLoad', (req, res, next) => {
    
    let videoFilePath = ''

    /* Code Placeholder */
    /* 保存文件 & 返回文件路径videoFilePath */
    // 此处代码仅作示范
    let des_file = "./public/" + req.files[0].originalname; //文件名
    fs.readFile( req.files[0].path, function (err, data) {  // 异步读取文件内容
        fs.writeFile(des_file, data, function (err) { // des_file是文件名，data，文件数据，异步写入到文件
            if( err ){
               console.log( err );
            }else{
                // 文件上传成功，respones给客户端
                response = {'value': 1 }
                videoFilePath = req.files[0].originalname
            }
            //    console.log( response );
            res.end( JSON.stringify( response ) );
        });
    });
    
    videoFilePath = './public' + videoFilePath

    // 启动
    exec(`python ./vtuber_link_start.py ${videoFilePath}`)
    processFlag = 1 
    res.send({'value': processFlag })
    next()
})

// 被:6789/kizuna.html调用，参数{value:blob}
server.post('/saveBlob', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", 'http://localhost:6789');
    let gifFilePath = ''

    /* Code Placeholder */
    /* 保存文件 & 返回文件路径gifFilePath */
    gifFilePath = 'true_exam.gif'   // 暂且使用静态地址

    gifURL = gifFilePath            // 更新全局唯一文件路径
    res.send({'value': gifURL })
    next()
})

// 被:3333/小程序调用
server.get('/getGifURL', (req, res, next) => {

    /* Code Placeholder */
    /* 访问数据库 */

    res.send({'value': gifURL })    // 暂且使用全局唯一文件路径
    gifURL = ''
    processFlag =  0 //设为空闲，其实为时过早
    next()
})

console.log("Listening http://localhost:5678/");