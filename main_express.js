var express = require("express");
//var oracledb = require('oracledb');

var fs = require("fs");
var app = express();

app.use(express.static('public'));
app.get("/", function(req, res){
	console.log(__dirname);
	res.sendFile(__dirname + "/" + "form.html");
});

app.get("/sayhello", function(req, res){
	var template = fs.readFileSync('template.html').toString();
	var formAngular = fs.readFileSync('form_angular.html').toString();
	var page = template.replace("##CONTENT##", formAngular);
	
	//console.log(__dirname);
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(page);
	res.end();
});

app.get("/key", function(req, res){
	var template = fs.readFileSync('template.html').toString();
	var formAngular = fs.readFileSync('key.html').toString();
	var page = template.replace("##CONTENT##", formAngular);
	
	//console.log(__dirname);
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(page);
	res.end();
});

app.get("/process_get", function(req, res){
	var response = {
		first_name:req.query.first_name,
		last_name:req.query.last_name
	};
	
	res.end(JSON.stringify(response));
});

var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("Example app listening at http://%s:%s", host, port);
});


/*oracledb.getConnection(
  {
    user          : "APPL_TDSELECTION",
    password      : "KOBM1E5MY3UL8DCP",
    connectString : "ofwi-int-vn-db:1521/ONLINE22"
  },
  function(err, connection)
  {
    if (err) { console.error(err); return; }
    connection.execute(
      "select * from TDSEL_ACCESS.APPLICATION_CONFIGURATION",
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
  });
*/