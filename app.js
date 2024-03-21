const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('express-flash');
const session = require('express-session');
const MemoryStore = require('session-memory-store')(session);


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mahasiswaRouter = require('./routes/mahasiswa');
const keahlianRouter = require('./routes/keahlian');
const pendidikanRouter = require('./routes/pendidikan');
const pemilikRouter = require ('./routes/pemilik');
const alatTangkapRouter = require('./routes/alat'); 
const dpiRouter = require('./routes/dpi'); 
const kapalRouter = require('./routes/kapal'); 

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
  resave: false,
  secret: 'secret'
}));


app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/keahlian', keahlianRouter);
app.use('/pendidikan', pendidikanRouter);
app.use('/pemilik',pemilikRouter);
app.use('/alat', alatTangkapRouter); 
app.use('/dpi', dpiRouter); 
app.use('/kapal', kapalRouter); 

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

module.exports = app;
