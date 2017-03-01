var express = require('express');
var app = express();
var uRl = require('url');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {
  response.render('pages/index');
});


app.get('/math', function(request, response) {
  
  console.log("Proccesing.....");
  parseDataMath(request,response);

});

app.get('/getRate', function(request, response) {
  
  console.log("Proccesing.....");
  parseData(request,response);

});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function parseDataMath(req, res)
{

  var url = req.url;
  var queryData = uRl.parse(req.url, true).query;

  operations(queryData.operation, Number(queryData.left), Number(queryData.right), res); 

}



function operations(op, left, right, res)
{
    var result = 0;

    if( op == "Add"){
        result = left + right;
    }
    else if(op == "Subtract"){
        result = left - right;
    }
    else if(op == "Divide"){
        result = left / right;
    }
    else if(op == "Multiply"){
        result = left * right;
    }
 
    res.render('pages/display.ejs', {op : op, left : left, right: right, result: result});
}



function parseData(req, res)
{

  var url = req.url;
  var queryData = uRl.parse(req.url, true).query;

  display(queryData.type, Number(queryData.weight), res); 

}



function display(type, weight, res)
{

    var price = calculatePrice(weight, type);

     // re assign to real weight
    if(weight == 4 && (type == "Letters (Stamped)" || type == "Letters (Metered)"))
         weight = 3.5;

    res.render('pages/displayOrder.ejs', {type : type, weight : weight, price : price });
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