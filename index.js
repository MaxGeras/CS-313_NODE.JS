var express = require('express');
var app = express();
var path = require('path');
var uRl = require('url');
var pg = require('pg');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded())

app.use(bodyParser.json()); 

pg.defaults.ssl = true;
 
// to run a query we can acquire a client from the pool, 
// run a query on the client, and then return the client to the pool 
app.get('/getquiz', function(request, response) {
  
     var myId = request.query.id;
    
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

       const results = [];

        const query = client.query('SELECT * FROM quiz');
        // Stream results back one row at a time
        query.on('row', (row) => {
          if(row.id == myId) //myId )
          {
            results.push(row);  
          }
        });
        // After all data is returned, close connection and return results
        query.on('end', () => {
          done();
         return response.json(results);
    });

  });
});


app.get('/getanswer', function(request, response) {
  
var answer = request.query.answer;
var myId = request.query.id;

   
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

           const results = [];
            const query = client.query('SELECT * FROM quiz');
            // Stream results back one row at a time
            query.on('row', (row) => {
              if(row.id == myId) //myId )
              {
              	if(row.answer === answer)
                results.push(row);
                else
                results.push('{"answer":"false"}');  
              }
            });
            // After all data is returned, close connection and return results
            query.on('end', () => {
            	done();
             return response.json(results);
        });

    });
});
 

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {
  response.render('pages/index');
});

// Team Activity
app.get('/home', function(request, response) {
  response.send("Hello World");
  //parseDataMath(request,response);
});



// Searching for 5000
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


