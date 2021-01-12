const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI

let connection;
const connect = async () => {
  try {
    connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('mongo connection open..')
    return connection;
  } catch (err) {
    console.error(`Could not connect to mongo... ${err}`);
  }
};

function getConnection() {
  return connection;
}

module.exports = { connect, getConnection };