const express = require('express');
const mysql = require('mysql');
const path = require('path');
const uuid = require('uuid');
const app = express();
app.use(express.static('www'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

const multer = require('multer');
let MyFill = multer.diskStorage({
    destination(req, file, callback) {
        // console.log(req);
        // console.log(file);
        callback(null, 'www/sb')
    },
    filename(req, file, callback) {
        // 保留名称
        console.log(file);
        var fname = uuid.v4().split('-').join("") + path.extname(file.originalname)
        callback(null, fname)
        cover = fname;

    }
})

var cover = '';
var zaixian = '';

// 添加
let save = multer({ storage: MyFill })
app.post('/up', save.single('MyFile'), (req, res) => {
    console.log(cover);
    console.log(JSON.parse(req.body.sb).bookname);

    if (cover == '') {
        mysqlObj.query(`insert into bookarr(bookname,bookjianjie,bookcover,bookzuoze) Value('${JSON.parse(req.body.sb).bookname}','${JSON.parse(req.body.sb).bookjianjie}','	https://img.paulzzh.com/touhou/random','${JSON.parse(req.body.sb).bookzuoze}')`)
    } else {
        mysqlObj.query(`insert into bookarr(bookname,bookjianjie,bookcover,bookzuoze) Value('${JSON.parse(req.body.sb).bookname}','${JSON.parse(req.body.sb).bookjianjie}','./sb/${cover}','${JSON.parse(req.body.sb).bookzuoze}')`)
    }


    cover = '';
    res.json('文件以上传')
})

var mysqlObj = mysql.createConnection({
    host: '0.0.0.0',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'books'
});

mysqlObj.connect(err => {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');

    }
});

app.get('/index', (req, res) => {

    mysqlObj.query('select * from bookarr order by Id', (err, data) => {
        // console.log(data);
        res.json(data);
    })
})

// 登录页接口
app.post('/login', (req, res) => {
    var flag = false;
    mysqlObj.query('select * from bookuser', (err, data) => {

        data.forEach(item => {
            if (req.body.username == item.username) {
                flag = true;
                if (req.body.password == item.password) {
                    zaixian = req.body.username;
                    res.json(`登陆成功`);
                } else {
                    res.json('密码错误');
                }
            }
        });
        if (!flag) {
            res.json('该账号不存在');
        }
    })
});

// 注册页接口
app.post('/reguser', (req, res) => {
    mysqlObj.query('select * from bookuser', (err, data) => {

        var flag = false;
        data.forEach(item => {
            if (req.body.username == item.username) {
                flag = true;
            }
        });
        if (flag) {
            res.json('该账号已被注册');
        } else {
            mysqlObj.query(`insert into bookuser(username,password) value('${req.body.username}','${req.body.password}');`);
            res.json(`注册成功`);
        }
    });
});

// 个人
app.get('/user', (req, res) => {
    if (zaixian == '') {
        res.json('您还没有登录');
    } else {
        res.json(zaixian);
    }
})

app.get('/tuicu', (req, res) => {
    zaixian = '';
    res.json('推出成功')
})



// 搜索
app.get('/search', (req, res) => {
    console.log(req.query.value);
    mysqlObj.query(`select * from bookarr where bookname like '%${req.query.value}%' or bookjianjie like '%${req.query.value}%' or bookzuoze like '%${req.query.value}%'`, (err, data) => {
        // console.log(data);
        res.json(data);
    })
});

// 个人页数据
app.get('/userdata', (req, res) => {
    console.log(req.query);

    mysqlObj.query(`select * from bookarr where bookzuoze='${req.query.zuoze}' order by Id`, (err, data) => {
        // console.log(data);
        res.json(data);
    })
})

// 删除
app.get('/delete', (req, res) => {
    console.log(req.query);
    mysqlObj.query(`delete from bookarr where Id='${req.query.id}'`);
})

app.listen(8080, () => {
    console.log('8080 server running...');
});