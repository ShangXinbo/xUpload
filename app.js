var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
const uploads = require('multer')({dest: 'upload'});
const upload = require(__dirname + '/upload');
const join = require('path').join;
var http = require('http');

var app = express();

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
    .post('/upload/submit', uploads.single('file'), upload.submit)  //单文件上传


var server = http.createServer(app);
server.listen(4000);
