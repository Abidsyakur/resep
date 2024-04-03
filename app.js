const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('express-flash');
const session = require('express-session');
const MemoryStore = require('session-memory-store')(session);
const bodyParser = require('body-parser');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const superusersRouter = require('./routes/superusers'); 
const resepRouter = require('./routes/resep'); 
const userresepRouter = require('./routes/userresep'); 
const favoritRouter = require('./routes/favorit'); 
const userfavoritRouter = require('./routes/userfavorit'); 


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie: {
      maxAge: 60000000000,
      secure: false,
      httpOnly: true,
      sameSite: 'strict',
      // domain: 'domainkkitananti.com',
  },
  store: new MemoryStore(),
  saveUninitialized: true,
  resave: true,
  secret: 'secret'
}));


app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/superusers', superusersRouter); 
app.use('/favorit', favoritRouter); 
app.use('/resep', resepRouter); 
app.use('/userresep', userresepRouter); 
app.use('/userfavorit', userfavoritRouter); 


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Middleware untuk memberikan data pengguna ke setiap permintaan
app.use(function(req, res, next) {
    res.locals.user = req.session.userId; // Misalnya, req.session.userId berisi ID pengguna dari sesi
    next();
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Middleware untuk memberikan data pengguna ke setiap permintaan
app.use(function(req, res, next) {
    res.locals.user = req.user; // Misalnya, req.user berisi informasi pengguna dari sesi
    next();
});

module.exports = app;
