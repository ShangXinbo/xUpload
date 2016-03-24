
'use strict';

var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer({dest: 'uploads'})
var fs = require('fs')

GLOBAL.modulePath = __dirname + '/modules/'

var app = express()

app
.set('view engine', 'jade')
.use(express.static('./static/'))
.use(bodyParser.json())
.set('views', './views')
.get('/',function(req, res) {
	res.send('this is index page')
})
.get('/upload',function(req,res){
    res.render('index',{title:"shang",message:'点我上传'});
})
.post('/upload/submit', upload.single('file'), function(req,res){  
    console.log(req.body);
    console.log(req.file);
    /*fs.open(req.file.originalname,'w','0644',function(e,fd){
        if(e) throw e;
        fs.read(req.file.path,function(err,data){
            if(err){
                console.log(err);
            }else{ 
                console.log(data.length);
            }
            fs.write(fd,data,function(e){
                if(e) throw e;
                fs.closeSync(fd);
            });
        })
        
    });*/
    res.end();
})

app.listen(3000)