const mongoose = require('mongoose');
const Question = require('../models/question'); // Adjust the path as needed
const dotenv=require("dotenv");
const { questions } = require('./questions');
dotenv.config()//
//const dbURI = `mongodb+srv://${DB_USER}:${DB_PSWD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`; // Replace with your database URI

  const DB_USER = "dbAdmin";
  const DB_PSWD = "PfqRqc0qBPLCMelf";
  const DB_CLUSTER = "vod.pkpti6c";
  const DB_NAME = "Pokieme";
  PORT=5000

  console.log(
    questions.map((question) => ({
      text: question.text,
      options: question.options,
    }))
  );

  /*  const sanitizedQuestions = questions.map((question) => ({
    ...question,
    options: question.options.map((option) => option.text), // Extract `text` property
  }));  */
  
  //const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSWD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const dbURI = `mongodb+srv://${DB_USER}:${DB_PSWD}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
// MongoDB connection
const seedDatabase = async () => {
  try {
    await mongoose.connect(dbURI, {});

    console.log('Connected to MongoDB');
/* 
    const sanitizedQuestions = questions.map((question) => {
      const sanitizedOptions = question.options
        .filter((option) => option && option.text)
        .map((option) => option.text);

      return {
        ...question,
        options: sanitizedOptions,
      };
    }); */

    await Question.insertMany(questions);
    console.log('Questions inserted successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDatabase();
