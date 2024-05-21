let http = require('http');
let port = 80;
let server = http.createServer(requestHandler);
server.listen(port);
console.log("Server is running on port:" + port);

let httpControllers = require('./httpControllers');
let commandlineControllers = require('./commandlineControllers');
let redisControllers = require('./redisControllers');
        
function requestHandler(request, response){
    console.log('request:', request.url);
    command = request.url.split('/')[1];

    let commands = {
        'favicon.ico': function(){

        },
        page1: function(){
            response.writeHead(200, { 'Content-Type': 'text/plain'});
            response.write('this is page1');
            response.end();
        },
        page2: function(){
            httpControllers.text(request, response);
        },
        page3: function(){
            httpControllers.textFile(request, response);
        },
        create: function(){
            httpControllers.createFile(request, response);
        },
        copy: function(){
            httpControllers.copyFile(request, response);
        },
        redisCreate: function(){
            let name = request.url.split('/')[2];
            let body = request.url.split('/')[3];
            redisControllers.create(name, body);
        },
        page: function(){
            httpControllers.htmlFile(request, response);
        },
        sum: function(){
            //httpControllers.sum(request, response);
            httpControllers.sumController[request.method](request, response);
        },
        multiply: function(){
            httpControllers.multiply(request, response);
        }
    }

    let data = ''
    request.on('data', function(chunk){
        data += chunk;
    })
    request.on('end', function(){
        console.log(1, typeof data, data)
        if(data){
            request.data = JSON.parse(data);
        }
        else{
            request.data = data;
        }
        console.log(2, typeof request.data, request.data)
        commands[command]();
    })
   
}

if(process.argv[2]){
    let command = process.argv[2];

    let commands = {
        page1: function(){
            commandlineControllers.text();
        },
        create: function(){
            let name = process.argv[3];
            let body = process.argv[4];
            commandlineControllers.create(name, body);
        },
        redisCreate: function(){
            let name = process.argv[3];
            let body = process.argv[4];
            redisControllers.create(name, body);
        }
    }

    commands[command]();
}