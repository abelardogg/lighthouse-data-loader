const express = require('express')
const app = express();
const appRouter = require('./private/router/web.js');
const apiRouter = require('./private/router/api.js');

const errorPageHandler = require('./private/controllers/error');
require('dotenv').config()

// CONFIG
// require('./private/services/db-connection.js');
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.json())

// app.use(function(req, res, next){
//   let domain = `${req.protocol}://${req.hostname}`;
//   if(!domain.includes('localhost')){
//     domain = domain.replace(/http/,'https');
//   }
//   res.locals.domain = domain;

//   next();
// });

// routes
app.use('/', appRouter).use('/api', apiRouter);
  
// 404 handler
app.use(function(req, res, next) {
    console.log();
    errorPageHandler.notFoundPage(req, res, next);
});

  app.listen(process.env.PORT || 3000, function(){
    console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});