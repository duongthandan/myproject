var express = require("express");
//var oracledb = require('oracledb');

var fs = require("fs");
var request = require("request");
var bodyParser = require('body-parser')
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

app.use(express.static('public'));
app.get("/", function(req, res){
	
	//test 
	var request = require('request');
	request('http://ofwi-int-vn-hcm.aavn.local:9230', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body) // Print the google web page.
		 }
	})



	console.log(__dirname);
	res.sendFile(__dirname + "/" + "form.html");
});

function buildPageFromTemplate(fileContent) {
	var template = fs.readFileSync('template.html').toString();
	var contentHtml = fs.readFileSync(fileContent).toString();
	var page = template.replace("##CONTENT##", contentHtml);
	return page;
}

function buildResponse(res, page) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(page);
	res.end();
}

app.get("/sayhello", function(req, res){
	var page = buildPageFromTemplate('form_angular.html');
	buildResponse(res, page);
});

app.post("/dosearch", function(req, res){
	var requestTemplate = fs.readFileSync('requestTemplate.txt').toString();
	var requestComplete = requestTemplate.replace(/##COMPANY_NAME##/g, req.body.companyName);
	
	request.post({
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		url:     'http://ofwi-int-vn-hcm.aavn.local:9230/company-search-new/company/_search',
		body:    requestComplete
	}, function(error, response, body){
		var obj = JSON.parse(body);

		var result = [];
		for (var i = 0; i < obj.hits.hits.length; ++i) {
			var source = obj.hits.hits[i]._source;
			var company = {};
			company.id = obj.hits.hits[i]._id;
			company.name = source.companyName;
			company.status = source.status;
			result.push(company);
		}
		
		res.write(JSON.stringify(result));
		res.end();
	});
});


app.get("/companysearch", function(req, res){
	var page = buildPageFromTemplate('company_search.html');
	buildResponse(res, page);
});

app.get("/companydetail", function(req, res){
	request.get({
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		url:     'http://ofwi-int-vn-hcm.aavn.local:9230/company-search-new/company/' + req.query.id,
	}, function(error, response, body){
		var obj = JSON.parse(body);
		var source = obj._source;
		var company = {};
		company.id = obj._id;
		company.companyName = source.companyName;
		company.status = source.status;
		company.domicile = {};
		company.domicile.streetNr = source.domicileAddress.streetNr;
		company.domicile.city = source.domicileAddress.city;
		company.domicile.postcode = source.domicileAddress.postcode;
		company.domicile.state = source.domicileAddress.state;
		
		var page = buildPageFromTemplate('company_detail.html');
		page = page.replace("##COMPANY_DETAIL##", JSON.stringify(company));
		buildResponse(res, page);
	});
});

app.get("/key", function(req, res){
	var page = buildPageFromTemplate('key.html');
	buildResponse(res, page);
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