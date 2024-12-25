const mongoose = require("mongoose");
const dotenv=require("dotenv")
dotenv.config()//


//ocnstructing URL for
const mongodb_connection_string = () => {
  const { DB_CLUSTER, DB_NAME, DB_USER, DB_PSWD } = process.env;
  return`mongodb+srv://${DB_USER}:${DB_PSWD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
}; 

//Function to connect to Mongodb
const mongodb_connection = async () => {
  //Establish database connection
  try {
    const connection_string = mongodb_connection_string();
    await mongoose.connect(connection_string);
    console.log("connected to mongodb", connection_string)
  } catch (err) {
    console.error(err);
    //throw new err();
  }
};

module.exports = {
  mongodb_connection,
  mongodb_connection_string,
};