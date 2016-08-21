// new routes
// app/routes.js

// load up the user model
var controllerAM = require('../controller/accountManager');
var controllerSalesperson = require('../controller/salesperson');
var controllerAuth = require('../controller/auth');

module.exports = function(app, passport) {
// homepage route
app.get('/', controllerAuth.isLoggedIn, function(req, res) {
    res.render('home.ejs', {
        page_title: "T1 Admin"
    }); // load the index.ejs file
});

// login routes
// route to login page
app.get('/login', controllerAuth.loginPage);
// process the login form and sets cookie
app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }),
    function(req, res) {
        console.log("hello");
        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
            req.session.cookie.expires = false;
        }
        res.redirect('/');
    });
// logout
app.get('/logout', controllerAuth.logout);

// AccountManager routes
// get AM list
app.get('/AccountManagers', controllerAuth.isLoggedIn, controllerAM.list);
// add AM page
app.get('/AccountManagers/add', controllerAuth.isLoggedIn, controllerAM.addPage);
// insert new AM
app.post('/AccountManagers/add', controllerAuth.isLoggedIn, controllerAM.add);
// set AM inactive, removes from CMT dropdown
app.post('/AccountManagers/setInactive/:IdAccountManager', controllerAuth.isLoggedIn, controllerAM.setInactive);

//Salesperson routes
// get salesperson list
app.get('/Salespersons', controllerAuth.isLoggedIn, controllerSalesperson.list);
// add salesperson page
app.get('/Salespersons/add', controllerAuth.isLoggedIn, controllerSalesperson.addPage);
// insert new salesperson
app.post('/Salespersons/add', controllerAuth.isLoggedIn, controllerSalesperson.add);
// set salesperson to inactive, removes from CMT dropdown
app.post('/Salespersons/setInactive/:IdSalesperson', controllerAuth.isLoggedIn, controllerSalesperson.setInactive);

// redirect to homepage on unknown URL
app.get('*', function (req, res) {
    res.redirect('/');
});
};
