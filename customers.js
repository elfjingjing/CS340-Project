module.exports = function(){
    var express = require('express');
    var router = express.Router();


    /*Display all customers. Requires web based javascript to delete users with AJAX*/

    router.get('/',function(req,res){
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["customerOperations.js"];
        mysql.pool.query('SELECT * FROM Customers;', function(err, rows, fields){
          if(err){
            console.log(err);
           // next(err);
            res.status(500);
            res.render('500');
            return;
          }
           
          context.records = rows;
          res.render('customers', context);
        });
      });

    /* Adds a coupon, redirects to the coupon page after adding */
    router.post('/', function(req, res){
        /* console.log(req.body.homeworld)
        console.log(req.body) */
        var mysql =     req.app.get('mysql');
        var sql = "INSERT INTO Customers (firstName, middleName, lastName, email) VALUES (?,?,?,?)";
        var inserts = [req.body.firstName, req.body.middleName, req.body.lastName, req.body.email];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customers');
            }
        });
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Customers SET firstName=?, lastName=?, email=? WHERE customerID=?";
        var inserts = [req.body.firstName, req.body.lastName, req.body.email, req.params.id];
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

    /* Route to delete a coupon, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sqlItemsInOrders = "DELETE FROM ItemsInOrders where orderID in (SELECT orderID from Orders where customerID=?);";
        var sqlOrders = "DELETE FROM Orders where customerID=?;";
        var sqlCustomers = "DELETE FROM Customers WHERE customerID = ?";
        var deletes = [req.params.id];
        sql = mysql.pool.query(sqlItemsInOrders, deletes, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                sql = mysql.pool.query(sqlOrders, deletes, function(error, results, fields){
                if(error){
                    console.log(error)
                    res.write(JSON.stringify(error));
                    res.status(400);
                    res.end();
                }else{
                    sql = mysql.pool.query(sqlCustomers, deletes, function(error, results, fields){
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
            }
        })
    })

    return router;
}();
