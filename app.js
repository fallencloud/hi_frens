//dependencies
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

//initialize app
const app = express();

//import routes
const users = require('./routes/api/users');

//Passport Config
require('./config/passport')(passport);

//set up DB
//DB authentication
const db = require('./config/keys').mongoURI;

//mongoose middleware
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.info('MongoDB Connected'))
  .catch(err => console.error(err));

//Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// method-override middleware
app.use(methodOverride('_method'));

// express-session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
//Passport middleware
//must be after express session
app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware
app.use(flash());

// Global variables for messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// @route   GET 	/
// @desc    Show landing page
// @access  Public
app.get('/', (req, res) => {
  res.render('index');
});

//use routes
app.use('/api/users', users);

const port = process.env.PORT || 5000;

//create server
app.listen(port, () => {
  console.info(`Now listening on port ${port}`);
});
