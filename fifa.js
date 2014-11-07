var express = require('express');
var fortune = require('./lib/fortune.js');

var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({defaultLayout:'main', extname: '.hbs',
	helpers: {
		section: funtion(name, options) {
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

//Dummy weather middleware
app.use(function(req, res, next) {
	if(!res.locals.partials)res.locals.partials = {};
	res.locals.partials.weather = getWeatherData();
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

//Dummy weather data for weather partial
function getWeatherData(){
	return {
		locations: [ 
			{name: 'Portland', forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html', iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif', weather: 'Overcast', temp: '54.1 F (12.3 C)'}, 
			{name: 'Bend', forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html', iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif', weather: 'Partly Cloudy', temp: '55.0 F (12.8 C)'}, 
			{name: 'Manzanita', forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html', iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif', weather: 'Light Rain', temp: '55.0 F (12.8C)'}
		],
	};
};



