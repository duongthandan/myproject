var express = require("express");
var http = require("http");
var app = express();

var numberOfClient = 0;

app.use(express.static('public'));
app.get("/", function(req, res){
	console.log(__dirname);
	res.sendFile(__dirname + "/" + "pageUsingSocket.html");
});

app.get("/findById", function(req, res){
	var options = {
	   host: 'ofwi-int-vn-hcm.aavn.local',
	   port: '9230',
	   path: '/company-search/company/' + req.query.id
	};
	
	var callback = function(response){
		// Continuously update stream with data
		var body = '';
		response.on('data', function(data) {
			  body += data;
	   });
	   
	   response.on('end', function() {
		  // Data received completely.
		  //console.log(body);
		  res.write(body);
		  res.end();
	   });
	}
	// Make a request to the server
	var request = http.request(options, callback);
	request.end();


});

var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("Example app listening at http://%s:%s", host, port);
});


var io = require("socket.io")(server);


io.on("connection", function(socket){
	console.log("has a connection");
	
	socket.on("send", function(data){
		numberOfClient++;
		console.log(data);
		
		io.emit('hasMsg' + data.toId, { msg: data.msg });
	});
	//io.emit('news', { num: numberOfClient });
});