const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');

const app = express();
const upload = multer({dest:'uploads/'});

app.use(bodyParser.urlencoded({extended : false}));

app.set('view engine','pug');
app.set('views','./views');
app.locals.pretty=true;

app.get('/',function(req,res){
    res.send("welcome");
});

// 작성하기
app.get('/edit',function(req,res){
    fs.readdir('data', function(err,files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('edit', {topics:files});
    })
});

// 작성한 파일을 submit했을 때 보낸 뒤 나오는 라우팅? 컨트롤러? post
app.post('/edit/complete', function(req,res){
    var title = req.body.title;
    var description = req.body.description;
    
    fs.writeFile('data/'+title,description,function(err){
        if(err){
            res.status(500).send('interval Server Error');
        } res.redirect('/edit/complete/'+title);
    });
    res.send('HI, post! title is : ' + title + '! Description is : ' + description);
});

// 작성한 파일 읽기
app.get(['/edit/complete','/edit/complete/:id'], function(req,res){
    fs.readdir('data', function(err,files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        var id = req.params.id;
        if(id) {
            fs.readFile('data/'+id, 'utf8', function(err,data){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                res.render('view', {topics:files, title:id, description:data});
            })
        } else {
            res.render('view', {topics:files, title:'Welcome',description:'Hello JS'});
        }
    })
});

// upload접속시 화면
app.get('/upload',function(req,res){
    res.render('upload');
});

// post방식으로 접근한 사용자의 요청받기 위함
app.post('/upload', upload.single('userfile'), function(req,res){
    res.send('Success' + req.file.filename);
});

app.listen(3000,function(){
    console.log('Conneted 3000 port');
});