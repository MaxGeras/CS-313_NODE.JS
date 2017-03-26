var express = require('express');
var app = express();
var path = require('path');
var uRl = require('url');
var pg = require('pg');
var count = require('./globaldata.js');

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded())

app.use(bodyParser.json()); 

passport.serializeUser(function(user, done) {
  done(null, user.facebookId);
});
passport.deserializeUser(function(id, done) {
  routes.findUserById(id, function(err, user) {
    done(err, user);
  });
});


app.use(passport.initialize()); 
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: 143125189548390,
    clientSecret: 6,
    callbackURL: "https://pure-sands-99613.herokuapp.com/auth/facebook/callback",
     profileFields: ['id', 'displayName', 'link', 'about_me', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));



app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/test.html',
                                      failureRedirect: '/quizGroup.html' }));

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] })
);



pg.defaults.ssl = true;
 
// to run a query we can acquire a client from the pool, 
// run a query on the client, and then return the client to the pool 
app.get('/getquiz', function(request, response) {
  
     var myId = request.query.id;
    
       pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  
           if (err) throw err;

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

app.get('/updatequiz', function(request, response){

     console.log("INSERTING");
     console.log(count.total);

     updateQuiz(count.total);

     var result = {"Status":"success"};

     return response.json(result);
});


app.get('/getanswer', function(request, response) {
  
 var answer = request.query.answer;
 var myId = request.query.id;


  if(myId === count.id)
  {
    count.options = count.options.concat(" " + answer); 
    count.count++;
  }
  else
  {
    count.id = myId;
    count.count = 1;
    count.options = "";
  }
  
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  
  if (err) throw err;

     const results = [];

      const query = client.query('SELECT * FROM quiz');
      // Stream results back one row at a time
      query.on('row', (row) => {
        if(row.id == myId) //myId )
        {
        	if(row.answer === answer)
          {  
            results.push(row);
            count.options = count.options.concat(" " + row.answer);
            var points = totalPoints(count.count)
            count.total += points;
            insertQuestionsInfo(points, count.count, count.options, count.total)
          }
          else
          {
            results.push('{"answer":"false"}');
          }  
        }
      });
      // After all data is returned, close connection and return results
      query.on('end', () => {
        done();
       return response.json(results);
  });
 });
});


app.get('/authenticate', function(request, response) {
  
    var user = request.query.user;
    var pass = request.query.pass;

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  
  if (err) throw err;

       const results = [];

        const query = client.query('SELECT * FROM group_quiz');
        // Stream results back one row at a time
        query.on('row', (row) => {
          if(row.user_group === user && row.password_group === pass) //myId )
          {
            results.push(row); 
          }
          else
          {
            results.push('{"user_group":"false", "password_group":"false"}'); 
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


// Searching for 5000
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function insertQuestionsInfo(points, count, options, total)
{
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  
  if (err) throw err;

        const query = client.query(
            'INSERT INTO questions (points, tries, options) VALUES($1, $2, $3) RETURNING id', 
            [points, count, options], 
            function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    done();
                    console.log('row inserted with id: ' + result.rows[0].id);
                }

            }); 
    });
}



function totalPoints(count)
{
     var points = 0;

    if( count == 1)
    {
      points = 4;
    }
    else if(count == 2)
    {
      points = 2;
    }
    else if( count == 3)
    {
      points = 1;
    }
    else
    {
      points = 0;
    }

    return points;
}

function updateQuiz(count)
{
    console.log("updateQuiz() questions");
    console.log(count);

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  
  if (err) throw err;   
   const query = client.query(
          'INSERT INTO quizinfo (quizquesions, quizsummary, quizname, totalpoints) VALUES($1, $2, $3, $4) RETURNING id', 
          [1, 1, "Group Quiz 3", count], 
          function(err, result) {
              if (err) {
                  console.log(err);
              } else {
                done();
                  console.log('ROW QuizInfo with ID: ' + result.rows[0].id);
              }

       }); 
  });
}

