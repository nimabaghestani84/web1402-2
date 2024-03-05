//node .\03-f.js create x.txt salamSALAMsalam
//node .\03-f.js append x.txt salamSALAMsalam
//node .\03-f.js delete x.txt
//node .\03-f.js delete myDirName
//node .\03-f.js copy x.txt y.txt

//node .\04-a.js read x.txt
//noed .\04-a.js createRecord nasser torabzade nasser@x.com

let fs = require('fs');
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
        append: 'append  successfull.',
        create: 'writeFile  successfull.',
        read:  'readFile  successfull.',
        createRecord:  'createRecord done successfully.'
    }

    if(err){
        console.log('ERR: ', err);
    }
    else{
        console.log(messages[command])
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
    createRecord: function(){
        let data = {
            name: process.argv[3],
            family: process.argv[4],
            email: process.argv[5]
        }

        fs.readFile('database.json', {encoding: 'utf8'}, function(err, fileData){
            if(err){
                console.log('ERR: ', err);
            }
            else {
                fileData = JSON.parse(fileData);
                fileData.records.push(data);
                fileData = JSON.stringify(fileData);
                fs.writeFile('database.json', fileData, fsCallback);
            }
        });
    }
}

commands[command]();

// let x = ['AAAA', 'BBBB'];

// x.push(1);
// x.push(2);
// x.push("kjhkljhkj;lh");
// x.push({x:1, y:3});
// x.push(['A', 'B', 'C']);

// console.log(x)

