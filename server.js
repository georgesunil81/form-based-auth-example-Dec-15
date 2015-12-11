var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
app.use(session({
	secret: 'ASDFLJK!@$%@$KJ@L#K$J'
}));

app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({extended:false}));

var checkAuth = function(req, res, next) {
	if (req.session.logged_in) {
		next();
	}
	else {
		return res.redirect('/login.html');
	}
};

app.post('/login', function(req, res) {
	if (req.body.username === 'test' && req.body.password === 'test123') {
		req.session.logged_in = true;
		return res.redirect('/secure.html');
	}
	else {
		return res.redirect('/login.html');
	}
});

app.get('/secure', checkAuth, function(req, res) {
	return res.sendFile(__dirname+'/secure/secure.html');
});
app.get('/api/secure-data', checkAuth, function(req, res) {
	return res.json({nuke_code:'12315AS'});
});

app.get('/logout', function(req, res) {
	delete req.session;
	return res.redirect('/login.html');
});

app.listen(8888);