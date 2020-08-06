module.exports = function(){
    var express = require('express');
    var router = express.Router();


    /*Display all items. Requires web based javascript to delete users with AJAX*/

    router.get('/',function(req,res){
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["itemOperations.js"];
        mysql.pool.query('SELECT * FROM Items;', function(err, rows, fields){
          if(err){
            console.log(err);
           // next(err);
            res.status(500);
            res.render('500');
            return;
          }
          mysql.pool.query('SELECT * FROM Categories;', function(err, categoryRows, fields){
            if(err){
              console.log(err);
             // next(err);
              res.status(500);
              res.render('500');
              return;
            }
             
            context.records = rows;
            context.categories = categoryRows;
            for (var i in rows) {
              rows[i].categories = categoryRows;
              for (var j in rows[i].categories) {
                if (rows[i].categoryID == rows[i].categories[j].categoryID) {
                    rows[i].categories[j].selected= "selected";
                } else {
                    rows[i].categories[j].selected= " ";
                }
              }
              console.log(context.records[i].categories);
            }

            res.render('items', context);
          });
        });
      });

    /*Display all items. Requires web based javascript to delete users with AJAX*/

    router.get('/:cid',function(req,res){
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["itemOperations.js"];
        mysql.pool.query('SELECT * FROM Items Where categoryID=?;', [req.params.cid], function(err, rows, fields){
          if(err){
            console.log(err);
           // next(err);
            res.status(500);
            res.render('500');
            return;
          }
          mysql.pool.query('SELECT * FROM Categories;', function(err, categoryRows, fields){
            if(err){
              console.log(err);
             // next(err);
              res.status(500);
              res.render('500');
              return;
            }
             
            context.records = rows;
            context.categories = categoryRows;
            for (var i in rows) {
              rows[i].categories = categoryRows;
              for (var j in rows[i].categories) {
                if (rows[i].categoryID == rows[i].categories[j].categoryID) {
                    rows[i].categories[j].selected= "selected";
                } else {
                    rows[i].categories[j].selected= " ";
                }
              }
              console.log(context.records[i].categories);
            }

            res.render('items', context);
          });
        });
      });

    /* Adds an item, redirects to the items page after adding */
    router.post('/', function(req, res){
        /* console.log(req.body.homeworld)
        console.log(req.body) */
        var mysql =     req.app.get('mysql');
        var sql = "INSERT INTO Items (itemName, price, categoryID) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.price, req.body.categoryId];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/items');
            }
        });
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Items SET itemName=?, price=?, categoryID=? WHERE itemID=?";
        var inserts = [req.body.name, req.body.price, req.body.categoryId, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete an item, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Items WHERE itemID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
