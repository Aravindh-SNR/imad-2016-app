var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var bodyParser = require('body-parser');

var config = {
    user: 'aravindh-snr',
    database: 'aravindh-snr',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/banner.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'banner.jpg'));
});

app.get('/feedback', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'feedback.html'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var pool = new Pool(config);

app.post('/add-feedback', function (req, res) {
   console.log('hello1');
   var username = req.body.username;
   var feedback = req.body.feedback;
   pool.query('INSERT INTO "feedback" (feedback, username) VALUES ($1, $2)', [feedback, username], function (err, result) {
       console.log('hello2');
      if (err) {
          console.log(err.toString());
          res.status(500).send(err.toString());
      } else {
          res.redirect('/get-feedback');
      }
   });
});

app.get('/get-feedback', function (req, res) {
   pool.query('SELECT feedback, name FROM "feedback"', function(err, result) {
       if(err) {
           res.status(500).send(err.toString());
       } else {
           res.send(JSON.stringify(result.rows));
       }
   }) 
});

var port = 8080;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
