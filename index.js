
// Source: http://linqed.eu/2014/10/07/deploying-angular-seed-to-heroku/

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/app'));
app.listen(process.env.PORT || 3000);
