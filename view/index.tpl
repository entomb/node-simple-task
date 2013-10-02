<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>simpleTask</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
        <meta name="HandheldFriendly" content="True">
        <meta name="MobileOptimized" content="320">

        <link rel="stylesheet" href="http://cdn.ink.sapo.pt/2.2.1/css/ink-min.css">
        <script src="http://express.dev:8081/socket.io/socket.io.js"></script>


    </head>
    <body>
        <script type="text/javascript">
            var socket = io.connect('http://express.dev:8081/');
            socket.on('filechange', function (data) {
                var tabler = document.getElementById('tabler');
                    tabler.innerHTML ="";
                for(i in data){
                    var _task = data[i];
                    var tr = document.createElement('tr');
                        tr.id = "row_"+_task.id;
                        var td = document.createElement('td');
                            td.innerHTML = _task.id;
                        tr.appendChild(td);
                        var td = document.createElement('td');
                            td.innerHTML = _task.text;
                        tr.appendChild(td);
                        var td = document.createElement('td');
                            td.innerHTML = _task.state;
                        tr.appendChild(td);
                        var td = document.createElement('td');
                            td.innerHTML = _task.date.created;
                        tr.appendChild(td);
                    tabler.appendChild(tr);
                }
            });

            socket.on('highlight', function (id) {
                animation_setup(document.getElementById("row_"+id));
            });



            function animation_setup(elem){
                window.animate_num = 0;
                window.animate = setInterval(function(){
                    elem.style.backgroundColor = "rgb(" +animate_num+ ",255,255)";
                    animate_num++;
                    if(animate_num>250){
                        elem.style.backgroundColor = "#FFF";
                        clearInterval(window.animate);
                    }
                },3);
            }

        </script>
        <div class="ink-grid">

                <h1>simpleTask</h1>

                <table class="ink-table ">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Task</th>
                            <th>State</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody id="tabler">
                        {% for task in tasks %}
                        <tr id="row_{{ task.id }}">
                            <td>{{ task.id }}</td>
                            <td>{{ task.text }}</td>
                            <td>{{ task.state }}</td>
                            <td>{{ task.date.created }}</td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>

        </div>
    </body>
</html>