//node .\03-f.js create x.txt salamSALAMsalam
//node .\03-f.js append x.txt salamSALAMsalam
//node .\03-f.js delete x.txt
//node .\03-f.js delete myDirName
//node .\03-f.js copy x.txt y.txt

//node .\04-a.js read x.txt
//noed .\04-a.js createRecord nasser torabzade nasser@x.com



//noed .\05-a.js readRecord 102
//noed .\05-a.js deleteRecord 102

//node .06-a.js redisCreate nasser testVal
//node .06-a.js redisCreate testVal
//node .06-b.js redisDelete testVal



let fs = require('fs');
let redis = require('redis');

let command = process.argv[2];
let name = process.argv[3];
let arg4 = process.argv[4];

function unlinkCallback(err) {
    if(err){
        if(err.code === 'EPERM'){
            fs.rmdir(name, rmdirCallback); 
        }
        else{
            console.log('ERR: ', err)
        }
    }
    else{
        console.log("unlink  successfull.")
    }
}

function rmdirCallback(err){
    if(err){
        console.log('ERR: ', err);
    }
    else{
        console.log('rmdir successfull')
    }
}

function fsCallback(err){
    let messages ={
        copy: 'copyFile successfull',
        append: 'append successfull.',
        create: 'writeFile successfull.',
        read:  'readFile successfull.',
        createRecord:  'createRecord done successfully.',
    };
    console.log(8)
            
    if(err){
        console.log('ERR: ', err);
    }
    else{            
        console.log(messages[command]);
    }
}

function readFileCallback(err, data){
    if(err){
        console.log('ERR: ', err);
    }
    else{
        console.log(messages[command]);
        console.log('Data: ', data)
    }
}

function createRecordController(requestParams, response){

    // let data = {
    //     name: process.argv[3],
    //     family: process.argv[4],
    //     email: process.argv[5]
    // }

    fs.readFile('database.json', {encoding: 'utf8'}, function(err, fileData){
        if(err){
            console.log('ERR: ', err);
        }
        else {
            fileData = JSON.parse(fileData);

            requestParams.id = 100 + fileData.records.length;
            fileData.records.push(requestParams);


            fileData = JSON.stringify(fileData);
            fs.writeFile('database.json', fileData, function(err){
                if(err){
                    console.log('ERR: ', err);
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.write('ERR: ' + err);
                    response.end();
                }
                else{            
                    console.log('createRecord success');
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.write('createRecord success');
                    response.end();
                }
                
            });
            
        }
    });
}

function readRecordController(){      
    function getArrayIndex(array, id){
        for(let i=0; i<array.length; i++){
            if(array[i].id == id ){
                return i;
            }
        }
    }
    
    fs.readFile('database.json', {encoding: 'utf8'}, function(err, fileData){
        if(err){
            console.log('ERR: ', err);
        }
        else { 
            fileData = JSON.parse(fileData);

            if(fileData.records[getArrayIndex(fileData.records, name)] === undefined){
                console.log("Record not found.")
            }
            else{
                console.log('record: ', fileData.records[getArrayIndex(fileData.records, name)]);   
            }                             
        }
    });
}

function deleteRecordController(request, response){
    function getArrayIndex(array, id){
        for(let i=0; i<array.length; i++){
            if(array[i].id == id ){
                return i;
            }
        }
    }
    name = request.url.split('/')[2];
    fs.readFile('database.json', {encoding: 'utf8'}, function(err, fileData){
        if(err){
            console.log('ERR: ', err);
        }
        else { 
            fileData = JSON.parse(fileData);
            // let deleteIndex = getArrayIndex(fileData.records, name);
            // fileData.records.splice(deleteIndex, 1);     

            console.log('getArrayIndex', getArrayIndex(fileData.records, name))
            let x = fileData.records.splice(getArrayIndex(fileData.records, name), 1); 
            console.log('fileData.records.splice', fileData.records);
            console.log('deleted items', x)
            
            fileData = JSON.stringify(fileData);
            fs.writeFile('database.json', fileData, function(e){
                if(e){
                    console.log('e:', e);
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.write('createRecord err');
                    response.end();
                }
                else{
                    console.log('success');

                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.write('createRecord success');
                    response.end();
                }
            });
        }
    });
}

async function redisCreateController(){
    const client = await redis.createClient({
        url: 'redis://127.0.0.1:6379'
    })
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

    try{
        await client.set(name, arg4);
        console.log('redisCreate successful');
    }
    catch(err){
        console.log('redis Create error: ', err);
    }

    await client.disconnect();
}

function redisDeleteController(){

}

let commands = { 
    create: function(){
        fs.writeFile(name, arg4, fsCallback);
    },
    append: function(){
        fs.appendFile(name, arg4, fsCallback); 
    },
    delete: function(){
        fs.unlink(name, unlinkCallback);
    },
    copy: function(){
        fs.copyFile(name, arg4, fsCallback);
    },
    read: function(){
        fs.readFile(name, {encoding: 'utf8'}, readFileCallback);
    },

    createRecord: createRecordController,
    readRecord: readRecordController,
    deleteRecord: deleteRecordController,

    redisCreate: redisCreateController,
    redisDelete: redisDeleteController
}   

//node .\04-a.js readRecord 2

//commands[command]();

// let x = ['AAAA', 'BBBB'];

// x.push(1);
// x.push(2);
// x.push("kjhkljhkj;lh");
// x.push({x:1, y:3});
// x.push(['A', 'B', 'C']);

// console.log(x);

let http = require('http');
let port = 80;


// let server = http.createServer(function(request, response){

//     console.log('request recieved');
//     console.log('request.method', request.method);
//     console.log('request.url', request.url);

//     if(request.url === '/redisCreate'){
//         name='TEST NAME';
//         arg4='TEST VALUE'
//         redisCreateController();
//     }

//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.write("this is a test!");
//     response.end();
// });

let server = http.createServer(requestHandler);

function requestHandler(request, response){
    console.log('request.method', request.method);
    console.log('request.url', request.url);

    command = request.url.split('/')[1];
    name = request.url.split('/')[2];
    arg4 = request.url.split('/')[3];


    
    
    let requestParams = {
        command:command,
        name:name,
        arg4:arg4
    }
    
    try {
        commands[command](request, response);
    }
    catch(e){

    }

    // response.writeHead(200, { 'Content-Type': 'text/plain' });
    // response.write("this is a test!");
    // response.end();
}

server.listen(port);
console.log("Server is running on port:" + port)
