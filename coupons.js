module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCoupons(res, mysql, context, complete){
        mysql.pool.query("SELECT couponID as id, amount, valid FROM Coupons", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.planets  = results;
            complete();
        });
    }



    /*Display all coupons. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getPeople(res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('people', context);
            }

        }
    });



    /* Adds a coupon, redirects to the coupon page after adding */

    router.post('/', function(req, res){
        /* console.log(req.body.homeworld)
        console.log(req.body) */
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Coupons (amount, valid) VALUES (?,?)";
        var inserts = [req.body.amount, req.body.valid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/coupons');
            }
        });
    });



    /* Route to delete a coupon, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Coupons WHERE character_id = ?";
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
