const express = require('express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');

const expressErrorHandler = require('express-error-handler');

const expressSession = require('express-session');

const app = express();

// 이렇게 pug를 넣었고, public폴더에서 실행되도록 했는데 왜 안되는거지?
app.set('view engine', 'pug');
app.set('views','./public');
app.locals.pretty = true;

// 서버에서 사용할 포트 정보를 port라는 이름으로 설정
app.set('port', process.env.PORT || 3000);

// 파싱
app.use(bodyParser.urlencoded({extended:false}));

// 파싱
app.use(bodyParser.json());

// static미들웨어로 특정 패스인 public폴더 접근 등록
app.use('/public', static(path.join(__dirname, 'public')));

// 쿠키 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
    secret:'my key',
    resave : true,
    saveUninitialized:true
}));

// Use MongoDB module
var MongoClient = require('mongodb').MongoClient;

// Declare variables for Database's objects
var database;

// Use mongodb module to connect the mongodb database
function connectDB() {
    // DB connect inf
    var databaseUrl = 'mongodb://localhost:27017/local';

    // DB connect
    MongoClient.connect(databaseUrl, function(err,db){
        if(err) throw err;

        console.log('DB connect : ' + databaseUrl);
        
        // database 변수에 할당
        database = db;
    });
}

//===== start server =====//
http.createServer(app).listen(app.get('port'),function(){
    console.log('start the server. port : ' + app.get('port'));

    //connection database
    connectDB();
});

//===== compare id to password
// Function that authenticates the user
var authUser = function(database, id, password, callback) {
    console.log('authUser 호출됨.');

    // users 컬렉션 참조
    var users = database.collection('users');

    // 아이디 및 비번 사용 통한 검색
    users.find({"id":id,"password":password}).toArray(function(err,docs){
        if(err) {
            callback(err,null);
            return;
        }
        if(docs.length > 0){
            console.log('아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음.', id, password);
            callback(null, docs);
        } else { 
            console.log("일치하는 사용자를 찾지 못함");
            callback(null,null);
        }
    });
}

// 로그인 처리 요청한 패스에 라우팅 함수 추가
app.post('/process/login', function(req,res){
    console.log('/process/login 호출');

    var paramId = req.param('id');
    var paramPassword = req.param('password');

    if(database) {
        authUser(database, paramId, paramPassword, function(err, docs){
            if(err) {throw err;}

            if(docs) {
                console.dir(docs);
            } else {

            }
        });
    } else {

    }
});


const router = express.Router(); // 라우터객체참조

// login routing function
router.route('/process/login').post(function(req,res){
    console.log('/process/login 호출됨.');
});

// router object
app.use('/', router);

// 404 err page
var errorHandler = expressErrorHandler({
    static : {
        '404' : './public/404.pug'
    }
});

// 오류 처리에 필요한 모듈
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// Server Start
http.createServer(app).listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
});