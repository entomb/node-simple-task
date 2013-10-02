var crypto  = require('crypto');
var fs      = require('fs');

function md5Hash(str){
    return crypto.createHash('md5')
                 .update(str)
                 .digest("hex")
                 .substring(6,12);
}




module.exports = {

    arr:[],

    get: function(hash){
        if(hash!==undefined){
           var index = this.find(hash);
           return this.arr[index] || false
        }else{
            return this.load();
        }
    },

    find:function(hash){
        this.load();
        console.log("looking for "+hash);

        for(i in this.arr){
            if(this.arr[i].id===hash){
                console.log("found on index "+i);
                return i
            }
        }

        console.log("not found");
        return false;
    },

    load: function(){
        try{
            this.arr = JSON.parse(fs.readFileSync('todo.json'));
            console.log("file loaded");
            return this.arr;
        }catch(e){
            return false
        }
    },

    add: function(newTaskDescription){
        var hash = md5Hash(newTaskDescription);

        if(this.get(hash)){
            return false;
        }

        this.arr.push({
            id: hash,
            state: 0,
            date: {
                created: Date.now(),
                done: null
            },
            text: newTaskDescription
        });

        console.log("new task "+hash);
        this.save();
        global.io.sockets.emit('highlight',hash);
        return true;
    },

    save: function(){
        if(global.io){
            global.io.sockets.emit('filechange',this.arr);
        }

        fs.writeFileSync('todo.json', JSON.stringify(this.arr));
        console.log("file saved");
    },

    remove: function(hash){

        var index = this.find(hash);
        if(index!==false){
            this.arr.splice(index, 1);
            console.log("task "+hash+" removed");
        }else{
            return false;
        }

        this.save();
        return true;
    },

    flush: function(){
        this.arr = [];
        console.log("flushing tasklist");
        this.save();
    },

    purge: function(){
        this.load();

        for(i in this.arr){
            if(this.arr[i].state){
                this.arr.splice(i, 1);
            }
        }

        console.log("purging tasklist");
        this.save();
    },

    set: function(hash,state){

        var index = this.find(hash);


        if(this.arr[index]!==undefined){
            if(state==='true'){
                this.arr[index].state = true;
                this.arr[index].date.done = Date.now();
                console.log("set task "+hash+" DONE");
            }else{
                this.arr[index].state = false;
                this.arr[index].date.done = null;
                console.log("set task "+hash+" reset");
            }

        }else{
            return false;
        }

        this.save();
        global.io.sockets.emit('highlight',hash);
        return true;
    }

};