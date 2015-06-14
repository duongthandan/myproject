/* Hello, World! program in node.js */
console.log("Hello, World!")

var http = require("http");
var url = require("url");
var fs = require("fs");

http.createServer(function (request, response) {

   // Parse the request containing file name
   var pathname = url.parse(request.url).pathname;
   
   // Print the name of the file for which request is made.
   console.log("Request for " + pathname + " received.");
   
   fs.readFile(pathname.substr(1), function(err, data){
	   if (err) {
		   console.error(err);		   
			// Send the HTTP header 
			// HTTP Status: 200 : OK
		   response.writeHead(404, {'Content-Type': 'text/html'});
	   } else {
			// Send the HTTP header 
			// HTTP Status: 200 : OK
			if (pathname.indexOf(".txt") > 0) {
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(data.toString());
			} else if (pathname.indexOf(".jpg") > 0) {
				response.writeHead(200, {'Content-Type': 'image/jpeg'});
				response.write(data);
			} else {
				response.writeHead(200, {'Content-Type': 'text/plain'});
				response.write(data.toString());
			}
	   }
	   response.end();
	   
   });
   
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');