let http = require('http');
let port = 80;
let server = http.createServer(requestHandler);
server.listen(port);
console.log("Server is running on port:" + port);

let httpControllers = require('./httpControllers');
        
function requestHandler(request, response){
    console.log('request:', request.url);
    command = request.url.split('/')[1];

    let commands = {
        'favicon.ico': function(){

        },
        page: function(){
            httpControllers.htmlFile(request, response);
        },
        sum: function(){
            httpControllers.sumController[request.method](request, response);
        },
        multiply: function(){
            httpControllers.multiply[request.method](request, response);
        },
        login: function(){
            httpControllers.login[request.method](request, response);
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
