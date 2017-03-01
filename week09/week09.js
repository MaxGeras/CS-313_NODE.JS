var express = require('express');
var app = express();
var uRl = require('url');

app.set('port', (process.env.PORT || 8000));

app.use(express.static(__dirname + '/'));

// views is directory for all template files
app.set('/', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {
  response.render('pages/week09');
});


app.get('/getRate', function(request, response) {
  
  console.log("Proccesing.....");
  parseData(request,response);

});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function parseData(req, res)
{

  var url = req.url;
  var queryData = uRl.parse(req.url, true).query;

  display(queryData.type, Number(queryData.weight), res); 

}



function display(type, weight, res)
{

    // access an array element
    // whole numbers
    if(weight == 3.5)
      newWeight = 4;

    var price = calculatePrice(newWeight, type);

    res.render('display.ejs', {type : type, weight : weight, price : price });
}


function calculatePrice(weight, type)
{
   
   if( type == "Letters (Stamped)")
   {

     var array = ["0.49","0.70","0.91","1.12"];
     
     return array[weight - 1];

   }else if( type == "Letters (Metered)"){
      
      var array = ["0.46","0.67","0.88","1.09"];
      
      return array[weight - 1];

   }else if( type == "Large Envelopes (Flats)"){

      var array = ["0.98","1.19","1.40","1.61","1.82",
      "2.03","2.24","2.45","2.66","2.87", "3.08", "3.29", "3.50"];
      
      return array[weight - 1];

   }else if( type == "Percils"){

      var array = ["2.67","2.67","2.67","2.67","2.85","3.03","3.21",
      "3.39","3.57","3.75","3.93","4.11","4.29"];
      
      return array[weight - 1];

   }else{
      return "Uknown type!";
   }
}