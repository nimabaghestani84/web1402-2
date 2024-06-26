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

    // if(command === 'page1'){
    //     response.writeHead(200, { 'Content-Type': 'text/plain'});
    //     response.write('this is page1');
    //     response.end();
    // }
    // if(command === 'page2'){
    //     httpControllers.text(request, response);
    // }
    // if(command === 'page3'){
    //     httpControllers.textFile(request, response);
    // }
    // if(command === 'create'){ 
    //     httpControllers.createFile(request, response);
    // }


    let commands = {
        'favicon.ico':function(){

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
            // let num1 = process.argv[3];
            // let num2 = process.argv[4];
            // redisControllers.create(num1+num2);
            httpControllers.sum(request, response);
        },
        multipy: function(){
            // let num1 = process.argv[3];
            // let num2 = process.argv[4];
            httpControllers.multipy(request, response);
        }
    }

    commands[command]();
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
        },
       
    }

    commands[command]();
}