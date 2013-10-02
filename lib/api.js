
var TaskList = require('./tasklist.js');

module.exports = {

    _error: function(text){
        this._print({
                    error:true,
                    msg: text
                });
    },

    _success: function(text){
        this._print({
                    error:false,
                    msg: text,
                    tasks:this._getTaskList()
                });
    },

    _print: function(text){
        this.response.send(text);
    },


    _getTaskList: function(){
        return TaskList.get();
    },


    add:function(req){

    }

}