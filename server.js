require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const port = process.env.PORT || 7777;
const connectDB = require('./config/connectDB');
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/error.middleware');

connectDB();

const app = express();


app.use(express.json());

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

app.use('/api/categories', require('./routes/categories.route'));

app.all("*", (req , res , next) => {
  next(new ApiError(`can't find this route ${req.originalUrl}` , 400));
})

app.use(globalError);


const server =app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

process.on('unhandledRejection' , (err)=> {
  console.error(`Unhandled rejection : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`App shut down...`);
    process.exit(1);
  });
})