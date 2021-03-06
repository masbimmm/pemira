const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
require('./config/passport')(passport);
const app = express();

mongoose.connect('mongodb://localhost/masbim', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Connecting DB');
    }
});
const db = mongoose.connection;
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );
app.use( express.static( "views/assets" ) );

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/dashboard/admin', require('./routes/admin.js'));
app.use('/dashboard/panitia', require('./routes/panitia.js'));
app.use('/dashboard/user', require('./routes/user.js'));
app.use('/dashboard', require('./routes/login.js'));
app.use('/artikel', require('./routes/artikel.js'));
app.use('/kbm', require('./routes/kbm.js'));
app.use('/', require('./routes/index.js'));
// app.use('/dashboard/user', require('./routes/user.js'));

app.get('*', function(req, res){
  res.render('home/404',{layout: "home/layout"});
})
app.post('*', function(req, res){
  res.render('home/404',{layout: "home/layout"});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
