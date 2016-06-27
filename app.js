const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const partials = require('express-partials');
const uploads = require('multer')({dest: 'upload'});
const join = require('path').join;
const http = require('http');
const upload = require(__dirname + '/upload');

const app = express();

// view engine setup
app.set('view engine', 'jade');
app.set('views', join(__dirname, 'views'))
app.use(partials());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app
    .get('/', upload.showtpl)
    //.post('/upload/submit',account.isLogged, uploads.array('file[]'), upload.submit)   //多文件上传
    .post('/upload/submit', uploads.single('file'), upload.submit)    //单文件上传

const server = http.createServer(app);
server.listen(4000);
