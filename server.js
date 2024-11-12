require("dotenv").config();
const express = require("express");
const hpp = require("hpp");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const rateLimiting = require("express-rate-limit");
const helmet = require("helmet");
const connectDB = require("./config/connectDB");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/error.middleware");

const port = process.env.PORT || 7777;

// Routes
const mountRoutes = require("./routes/main");

//** Connect to MongoDB
connectDB();

const app = express();

//** Middleware for parsing JSON requests
app.use(express.json({'limit' : '20kb'}));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

//** Prevent Http Param Pollution
app.use(hpp());
//** Security Headers (helmet)
app.use(helmet());
//** cors middleware
app.use(cors("*"));
//** Compression middleware (compression)
app.use(compression("*"));
//** Rate Limiting
app.use(
  rateLimiting({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200,
  })
);

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route ${req.originalUrl}`, 400));
});

app.use(globalError);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`App shut down...`);
    process.exit(1);
  });
});
