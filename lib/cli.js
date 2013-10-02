
var TaskList = require('./tasklist.js');
var colors   = require('colors');

module.exports = {

    _error: function(text){
        this._print("\n\t" + text.red)
    },

    _success: function(text){
        this._print("\n\t" + text.green + "\n\n" + this._getTaskList());
    },

    _print: function(text){
        this.response.send(text);
    },

    listTasks: function(){
        this._print(this._getTaskList());
    },

    _getTaskList: function(){

        var output = "Current Task List:\n";
        var taskArr =  TaskList.get();

        for(i in taskArr){
            var _task = taskArr[i];
            var _task_date = new Date(_task.date).toLocaleDateString();

            output+=(_task.state) ? "\n [✔] ".green.bold : "\n [ ] ".red.bold;
            output+=("("+_task.id+") ").grey;
            output+=" \t ";
            output+=(_task.state) ? _task.text.green.bold : _task.text;
        }

        return output;
    },


    addTask:function(req){
        if(req.body.t!==undefined && req.body.t.length>3){
            var task = req.body.t;
            if(TaskList.add(task)){
               this._success('new task: '+(task).bold);
            }else{
               this._error("I'm already doing that!...");
            }
        }else{
            this._error('invalid task description');
        }
    },


    getTask:function(req,res){
        if(hash = req.param('hash')){
            var task = TaskList.get(hash)

            if(task){
                this._print(task);
            }else{
                this._error('task '+hash+' not found!');
            }

        }else{
            this._error('invalid task id');
        }

    },

    removeTask:function(req){
        if(hash = req.param('hash')){
            if(TaskList.remove(hash)){
                this._success('Task removed! ups!');
            }else{
                this._error('task '+hash+' not found!');
            }

        }else{
            this._error('invalid task id');
        }

    },

    setState:function(req){

        if(hash = req.param('hash')){
            if(state=req.param('state')){
                if(TaskList.set(hash,state)){
                    this._success('Task '+hash+' state changed.');
                }else{
                    this._error('error setting state.');
                }
            }else{
                this._error('invalid state (must be -x or -o)');
            }

        }else{
            this._error('invalid task id');
        }
    },

    flush:function(){
        TaskList.flush();
        this._error('ALL tasks deleted!');
    },

    purge:function(){
        TaskList.purge();
        this._success('all completed tasks deleted!');
    }

};