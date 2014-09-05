var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({defaultLayout:'main', extname: '.hbs' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

//home page
app.get('/', function(req, res){
	res.render('home');
});

//about page
app.get('/about', function(req, res){
	res.render('about', {fortune: fortune.getFortune(), pageTestScript:'/qa/tests-about.js'});
});

//create a team
app.get('/team/create', function(req, res){
	res.render('team/create');
});

//edit a team
app.get('/team/edit', function(req, res){
	res.render('team/edit');
});

//support page
app.get('/support', function(req, res){
	res.render('support');
});
	
//custom 404 page
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

//custom 500 page
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log( 'Express started on http://localhost: ' + app.get('port') + '; press Ctrl-C to terminate.' );
});

//Check Request Header Info
app.get('/headers', function(req, res){
	res.set('Content-Type', 'text/plain');
	var s= '';
	for(var name in req.headers) s += name + ':' + req.headers[name] + '\n';
	res.send(s);
});

//Disable Express's X-Powered-By header
app.disable('x-powered-by');

