var mysql = require('mysql');
var md5 = require('md5');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

// display all active AMs
exports.list = function(req, res) {
    connection.query("SELECT am.IdAccountManager, CONCAT(u.FirstName, ' ', u.LastName) AS `AccountManager` FROM User u INNER JOIN AccountManager am ON am.IdUser = u.IdUser WHERE am.Active = 1", function(err, rows) {
        if (err)
            console.log("Error Selecting : %s ", err);
        res.render('AccountManagers', {
            page_title: "AccountManagers",
            data: rows
        });
    });
};

// render add AM page
exports.addPage = function(req, res) {
    res.render('add_AccountManager', {
        page_title: "Add AccountManagers"
    });
};

// inserts new AM into AccountManager table
exports.add = function(req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var data = input.email;
    connection.query('SELECT IdUser FROM User WHERE IsAdmin = 1 AND Email like ' + mysql.escape(data), function(err, rows) {
        if (err)
            console.log("Error selecting AccountManager : %s ", err);
        else {
            if (rows.length === 1) {
                connection.query("INSERT INTO AccountManager SET IdUser = " + mysql.escape(rows[0].IdUser) + ", Active = 1", function(err, ins) {
                    if (err)
                        console.log("Error inserting : %s ", err);
                    res.redirect('/AccountManagers');
                });
            }
            else {
              res.redirect('/AccountManagers');
            }
        }
    });
};

// inactivates current AM
exports.setInactive = function(req, res) {
    var id = req.params.IdAccountManager;
    connection.query('UPDATE AccountManager SET Active = 0 WHERE IdAccountManager = ?', [id], function(err, rows) {
        if (err)
            console.log("Error setting account manager inactive : %s ", err);
        res.redirect('/AccountManagers');
    });
};
