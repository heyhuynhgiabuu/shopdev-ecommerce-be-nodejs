const express = require('express'); // import express
const morgan = require('morgan'); // ghi log request
const helmet = require('helmet'); // bảo mật cho ứng dụng express
const compression = require('compression'); // nén response
const app = express(); // khởi tạo express app

// init middleware
// Sử dụng format combined cho production 
if (process.env.NODE_ENV === 'production') {   
	app.use(morgan('combined'));  // combined is the Apache style output
} else {   
	app.use(morgan('dev'));  // dev is the default format
}

app.use(helmet());
app.use(compression()); 


// init db


// init routes
app.get('/', (req, res, next) => {
    const strCompression = 'Hello World!';
  return res.status(200).json({
    message: 'Welcome to the API',
    metadata: strCompression.repeat(100000), // 10000 times
  });
});


// handling error


module.exports = app;