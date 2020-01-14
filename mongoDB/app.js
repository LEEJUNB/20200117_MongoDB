const express = require('express'),
    http = require('http'),
    path = require('path');

const bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static'),
    errorHandler = require('errorhandler');

const expressErrorHandler = require('express-error-handler');

const expressSession = require('express-session');

const app = express();

// 서버에서 사용할 포트 정보를 port라는 이름으로 설정
app.set('port', precess.env.PORT || 3000);

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

const router = express.Router(); // 라우터객체참조

// login routing function
router.route('/process/login').post(function(req,res){
    console.log('/process/login 호출됨.');
});

// router object
app.use('/', router);

// 404 err page
const errorHandler = expressErrorHandler({
    static : {
        '404' : './public/404.html'
    }
});

// 오류 처리에 필요한 모듈
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// Server Start
http.createServer(app).listen(app.get('port'), function(){
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
});