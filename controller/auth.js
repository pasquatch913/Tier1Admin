var mysql = require('mysql');
var md5 = require('md5');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

exports.loginPage = function(req, res) {
    // render the login page and pass in any flash data if it exists
    res.render('login.ejs', {
        page_title: "Login",
        message: req.flash('loginMessage')
    });
};

// terminate current session
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/login');
};

// checks to see if user is currently logged in
exports.isLoggedIn = function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/login');
};
