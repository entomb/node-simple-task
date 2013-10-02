var TaskList = require('./tasklist.js');
var swig = require('swig');


module.exports = {

    _display:function(template,data){

        var tpl = swig.compileFile('./view/'+template);
        html = tpl({
                   data: data,
                   tasks: TaskList.get()
                });

        this.response.send(200,html);
    },


    index: function(req){

        this._display('index.tpl');
    }

}