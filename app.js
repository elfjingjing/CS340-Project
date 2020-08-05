var express = require('express');
var mysql = require('./dbcon.js');

var app = express();

app.use('/style.css', express.static(__dirname + '/views/style.css'));
app.use('/images', express.static(__dirname + '/views/images'));

// serve files from the public directory
app.use(express.static('public'));

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support url encoded bodies

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9813);
app.set('mysql', mysql);

app.get('/',function(req,res){
  var context = {};
  res.render('index', context);
});

app.get('/index.html',function(req,res){
  var context = {};
  res.render('index', context);
});

app.get('/about.html',function(req,res){
  var context = {};
  res.render('about', context);
});


app.get('/categories.html',function(req,res){
  var context = {};
  mysql.pool.query('SELECT * FROM Categories;', function(err, rows, fields){
    if(err){
      console.debug(err);
     // next(err);
      res.status(500);
      res.render('500');
      return;
    }
     
    context.records = rows;
    res.render('categories', context);
  });
});

app.get('/items.html',function(req,res){
  var context = {};
  mysql.pool.query('SELECT * FROM Items;', function(err, rows, fields){
    if(err){
      console.debug(err);
     // next(err);
      res.status(500);
      res.render('500');
      return;
    }
    mysql.pool.query('SELECT * FROM Categories;', function(err, categoryRows, fields){
    if(err){
      console.debug(err);
     // next(err);
      res.status(500);
      res.render('500');
      return;
    }
     
    context.records = rows;
    for (var i in rows) {
      rows[i].categories = categoryRows;
    }

    res.render('items', context);
  });
     
    
  });
});

app.get('/customers.html',function(req,res){
  var context = {};
  mysql.pool.query('SELECT * FROM Customers;', function(err, rows, fields){
    if(err){
      console.debug(err);
     // next(err);
      res.status(500);
      res.render('500');
      return;
    }
     
    context.records = rows;
    res.render('customers', context);
  });
});

app.use('/coupons', require('./coupons.js'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
