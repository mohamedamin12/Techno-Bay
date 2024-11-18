require('dotenv').config();
const fs = require('fs');
const Product = require('./models/products.model');
const connectToDB = require('./config/connectDB');

// connect to DB
connectToDB();


// Read data
const products = JSON.parse(fs.readFileSync('./utils/dummyData/phones.json'));

// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);

    console.log('Data Inserted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}