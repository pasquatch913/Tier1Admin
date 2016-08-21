var mysql = require('mysql');
var md5 = require('md5');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

exports.list = function(req, res) {
    connection.query('SELECT IdSalesPerson, DisplayName FROM Salesperson WHERE IsActive = 1', function(err, rows) {
        if (err)
            console.log("Error Selecting : %s ", err);
        res.render('salespersons', {
            page_title: "Salespersons",
            data: rows
        });
    });
};

exports.addPage = function(req, res) {
    res.render('add_salesperson', {
        page_title: "Add Salespersons"
    });
};

exports.add = function(req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var data = input.email;
    connection.query("SELECT CONCAT(FirstName, ' ', LastName) AS DisplayName FROM User WHERE Email like " + mysql.escape(data), function(err, rows) {
        if (err) {
            console.log("Error selecting Salesperson : %s ", err);
        }
        else {
            if (rows.length === 1) {
                connection.query("SELECT MAX(IdSalesPerson) + 1 AS newId FROM Salesperson", function(err, newIdSalesPerson) {
                    if (err) {
                        console.log("Error determining next IdSalesPerson : %s ", err);
                    }
                    else {
                        connection.query("INSERT INTO Salesperson SET IdSalesPerson = " + newIdSalesPerson[0].newId + ", DisplayName = '" + rows[0].DisplayName + "', IsActive = 1", function(err, ins) {
                            if (err) {
                                console.log("Error inserting : %s ", err);
                            }
                            res.redirect('/Salespersons');
                        });
                    }
                });
            }
            else {
                res.redirect('/Salespersons');
            }
        }
    });
};

exports.setInactive = function(req, res) {
    var id = req.params.IdSalesperson;
    connection.query('UPDATE Salesperson SET IsActive = 0 WHERE IdSalesPerson = ?', [id], function(err, rows) {
        if (err)
            console.log("Error setting salesperson inactive : %s ", err);
        res.redirect('/Salespersons');
    });
};
