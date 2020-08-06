module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*Display all categories. Requires web based javascript to delete users with AJAX*/

    router.get('/',function(req,res){
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["categoryOperations.js"];
        mysql.pool.query('SELECT * FROM Categories;', function(err, rows, fields){
          if(err){
            console.log(err);
           // next(err);
            res.status(500);
            res.render('500');
            return;
          }
           
          context.records = rows;
          res.render('categories', context);
        });
      });

    /* Adds a category, redirects to the categories page after adding */
    router.post('/', function(req, res){
        /* console.log(req.body.homeworld)
        console.log(req.body) */
        var mysql =     req.app.get('mysql');
        var sql = "INSERT INTO Categories (categoryName) VALUES (?)";
        var inserts = [req.body.name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/categories');
            }
        });
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Categories SET categoryName=? WHERE categoryID=?";
        var updates = [req.body.name, req.params.id];
        sql = mysql.pool.query(sql,updates,function(error, results, fields){
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

    /* Route to delete a coupon, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sqlItem = "DELETE FROM Items WHERE categoryID = ?";
        var sqlCategory = "DELETE FROM Categories WHERE categoryID = ?";
        var deletes = [req.params.id];
        sql = mysql.pool.query(sqlItem, deletes, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                sql = mysql.pool.query(sqlCategory, deletes, function(error, results, fields){
                    if(error){
                        console.log(error)
                        res.write(JSON.stringify(error));
                        res.status(400);
                        res.end();
                    }else{
                        res.status(202).end();
                    }
                })
            }
        })
    })

    return router;
}();
