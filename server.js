var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.use(require('./routes/league.js'));
app.use(require('./routes/squad.js'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.set('options', {
    hostname: 'api.football-data.org',
    headers: { 'X-Auth-Token': '9f20857b262f461680629b9aa867166f' },
    //Get your API key from api.football-data.org/register
    //Or, comment out headers (not recommended)
    method: 'GET'
});

var port = 8080;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
