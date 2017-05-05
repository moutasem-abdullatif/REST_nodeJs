var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser'),
    io = require('socket.io').listen(http),
    request = require('request'),
    path = require('path'),
    cors = require('cors'),
    port = process.env.PORT || 5000;

var index = express.Router();
var create = express.Router();


//configure the server
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));
app.use('/', index);
app.use('/create',create);


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//start listening to PORT
http.listen(port, () => {
    console.log(`magic is happening on *:${port}`);
});


//index page
index.get('/', (req, resp, next) => {
    request('http://localhost:4000/api/tasks',(error,response,body)=>{
        var data = JSON.parse(body);
        resp.render('index.ejs',{data});
    });

});


create.get('/',(req,resp , next )=>{
    resp.render('create.ejs');
});

create.post('/',(req,resp , next)=>{
    request.post('http://localhost:4000/api/tasks',{form:req.body},(error,response,body)=>{
       console.log(body);
       resp.redirect('/');
    });

});

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('delete task',(data)=>{
       request.del("http://localhost:4000/api/tasks/"+data
       ,(err, response , body)=>{
           console.log(body);
       });
        socket.broadcast.emit('task deleted',{
           id:data
       });
    });
});




    