module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCategories(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Categories", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.categories  = results;
            complete();
        });
    }

    function getItems(res, mysql, context, complete){
        mysql.pool.query("SELECT * FROM Items", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.items  = results;
            complete();
        });
    }

    function getOrders(res, mysql, context, complete){
        mysql.pool.query("select Orders.orderID, Orders.payment, Orders.orderDate, Orders.couponID, " +
            "Customers.firstName, Customers.lastName, Items.itemName, ItemsInOrders.quantity from Orders " +
            "left join Customers on Orders.customerID = Customers.customerID " +
            "right join ItemsInOrders on Orders.orderID = ItemsInOrders.orderID " +
            "left join Items on Items.itemID = ItemsInOrders.itemID", 
            function(error, results, fields){
                if(error){
                    res.write(JSON.stringify(error));
                    res.end();
                }
                // results.name = results.firstName + " " + results.lastName;
                context.orders  = results;
                complete();
        });
    }
    
    function addOrder(res, mysql, context, complete){
        var sql = "INSERT INTO Orders (payment, orderDate,customerID,couponID) VALUES (?,?,?,?)";
        var inserts = [req.body.payment, req.body.orderDate,req.body.customerID,req.body.couponID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/orders');
            }
        });

        
        var sql = "INSERT INTO Orders (payment, orderDate,customerID,couponID) VALUES (?,?,?,?)";
        var inserts = [req.body.payment, req.body.orderDate,req.body.customerID,req.body.couponID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/orders');
            }
        });
    }
    
    router.get('/',function(req,res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["orderOperations.js"];
        getCategories(res, mysql, context, complete)
        getItems(res, mysql, context, complete)
        getOrders(res, mysql, context, complete)
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('orders', context);
            }
        };
    });

    /* Add an order, redirects to the order page after adding */
    router.post('/', function(req, res){
        console.log(req.body);
        var orderId = null;
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Orders (payment, orderDate,customerID,couponID) VALUES (?,?,?,?)";
        
        var coupon = req.body.couponNum === "" ? null : req.body.couponNum;
        var inserts = [req.body.payment, req.body.orderDate,req.body.customerID, coupon];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                console.log(results);
                        
                var sql = "INSERT INTO ItemsInOrders (itemID, orderID, quantity, sweet, iced) VALUES ?;";
                var inserts = [];
                inserts.push([Number(req.body.itemInCategory1), Number(results.insertId), Number(req.body.quantity1), Number(req.body.sweetOption1), Number(req.body.icedOption1)]);
                if (req.body.selectCategory2 != "-1" && req.body.selectItem2 != "-1") {
                    inserts.push([Number(req.body.itemInCategory2),
                        Number(results.insertId),
                        Number(req.body.quantity2),
                        Number(req.body.sweetOption2),
                        Number(req.body.icedOption2)]);
                }
                console.log(sql);
                sql = mysql.pool.query(sql, [inserts], function(error, results, fields){
                    if(error){
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        console.log(results);
                        res.redirect('/orders');
                    }
                });
            }
        });
    });

    


    /* Route to delete a coupon, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Coupons WHERE couponID = ?";
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
