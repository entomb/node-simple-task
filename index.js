/**
 * @app Simple Tasks
 *
 */

var express = require('express');
var app = express();
var server = require('http').createServer(app);
global.io = require('socket.io').listen(server);

server.listen(8081);
console.log('sockets on port 8081');

var TaskListCLI = require('./lib/cli.js');
var TaskListWEB = require('./lib/web.js');

app.use(express.bodyParser());
app.use(function(req,res,next){
    TaskListCLI.response = res;
    //TaskListWEB.io = io.sockets;
    TaskListWEB.response = res;
    //console.log( "\n---------------- " + (new Date()) );
    next();
});

app.get('/',function(req,res){
   TaskListWEB.index();
});




/**
 * Append CLI routes
 */

    //@listTasks
    app.get('/cli', function(req){
        console.log("route for CLI > listTasks");
        return TaskListCLI.listTasks(req);
    });

    //@addTask
    app.post('/cli', function(req){
        console.log("route for CLI > addTask");
        return TaskListCLI.addTask(req);
    });

    //@flush
    app.post('/cli/flush', function(req){
        console.log("route for CLI > flush");
        return TaskListCLI.flush();
    });
    //@purge
    app.post('/cli/purge', function(req){
        console.log("route for CLI > purge");
        return TaskListCLI.purge();
    });


    //@getTask
    app.get('/cli/:hash', function(req){
        console.log("route for CLI > getTask");
        return TaskListCLI.getTask(req);
    });

    //@removeTask
    app.post('/cli/:hash/delete', function(req){
        console.log("route for CLI > removeTask");
        return TaskListCLI.removeTask(req);
    });

    //@setState
    app.post('/cli/:hash/state/:state', function(req){
        console.log("route for CLI > setState");
        return TaskListCLI.setState(req);
    });


app.listen(3000);
console.log('Listening on port 3000');
