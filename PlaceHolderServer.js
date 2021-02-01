const exec = require('child_process').exec;
const express = require('express');
const server = express()
server.listen(5678)
const fs = require("fs");
const path = require('path');
const formidable = require("formidable")
// const multer = require('multer');
// const upload = multer({ dest: './public/upload' })

var bodyParser = require('body-parser');/*post方法*/
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// server.use(bodyParser.urlencoded({extended: false}));

let processFlag = 0
let gifURL = ''

server.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3333');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

server.use(express.static("./public"));


server.post('/multer', function (req, res, next) {
    let base64Data = req.body.data[0]
    let filename = req.body.filename
    let videoFilePath = `./public/upload/${filename}`

    console.log('videoFilePath', videoFilePath);

    base64Data = base64Data.replace(/^data:video\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(videoFilePath, dataBuffer, function (err) {
        if (err) {
            res.end(err);
        }

        // 启动
        exec(`python ./vtuber_link_start.py ${videoFilePath}`)
        console.log(`python ./vtuber_link_start.py ${videoFilePath}`);
        // processFlag = 1
        res.send({ 'value': 1 })
        next()
    });
});

// 占位函数构成的临时服务器，只可演示参考
// 假设只有一个用户且文件名不冲突；多用户需要在小程序部分增加用户标记或实现注册用户管理




server.get('/getFlag', (req, res, next) => {
    res.send({ 'value': processFlag })
    next()
})

server.get('/setFlag', (req, res, next) => {
    processFlag = parseInt(req.query.value)
    res.send({ 'value': processFlag })
    next()
})

server.post('/upLoad', (req, res, next) => {

    let videoFilePath = ''

    /* Code Placeholder */

    console.log('req.file', req.file);

    var tmp_path = req.file.path;

    var target_path = 'public/' + req.file.originalname;
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function () { res.render('complete'); });
    src.on('error', function (err) { res.render('error'); });


    videoFilePath = './public' + videoFilePath
    // 启动
    exec(`python ./vtuber_link_start.py ${videoFilePath}`)
    processFlag = 1
    res.send({ 'value': processFlag })
    next()
})

// 被127.0.0.1:6789/kizuna.html调用
// 将blob对象保存为本地gif文件，前端需要由formData包装，不可直接作为data传送
server.post('/saveBlob', (req, res, next) => {
    let gifFilePath = ''
    res.header("Access-Control-Allow-Origin", 'http://127.0.0.1:6789');

    console.log('进入Blob保存阶段');
    var form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect(303, '/error')

        sourceFile = files.data.path
        let data = fs.readFileSync(sourceFile);

        file_name = sourceFile.split('\\').slice(-1)[0]

        gifURL = file_name + '.gif'
        console.log('gifURL update:', gifURL);
        targetfile = `public/${file_name}.gif`
        //   fs.ensureFile(targetfile);

        data = new Buffer(data).toString('base64');
        const dataBuffer = new Buffer(data, 'base64'); //把base64码转成buffer对象
        // console.log('dataBuffer是否是Buffer对象：' + Buffer.isBuffer(dataBuffer)); // 输出是否是buffer对象
        // 存储文件
        fs.writeFile(targetfile, dataBuffer, err => {
            if (err) {
                success = false;
                msg = '失败';
                console.log(err);
            }
        });
    })

    //保存文件 & 返回文件路径gifFilePath 
    processFlag = 3
    console.log('渲染文件生成完毕');
    res.send({ 'value': gifURL })
    next()
})

// 被:3333/小程序调用
server.get('/getGifURL', (req, res, next) => {
    console.log('gifURL called',gifURL);
    /* Code Placeholder */
    /* 访问数据库 */
    if (gifURL != '') {
        res.send({ 'value': gifURL })    // 暂且使用全局唯一文件路径
        gifURL = ''
        processFlag = 0 //设为空闲，其实为时过早
    }
    next()
})

console.log("Listening http://localhost:5678/");