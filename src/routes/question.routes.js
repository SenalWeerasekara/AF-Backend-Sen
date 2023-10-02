import express from 'express'
import { 
    addQuestionAnswer, 
    getAllQuestions, 
    getSingleUserQuestions, 
    getEveryQuestions,   
    updateAnswer, 
    deleteAnswer,
    deleteQuestion,
    searchQuestion
    } from '../controller/question'
const { body , validationResult } = require('express-validator');

const questionRouter = express.Router()

// Add a question or answer
questionRouter.post(
    '/addQuestionAnswer',
    [
      // Sanitize the entire request body
      body('Answers.answer').escape(),
      body('Question').escape(),
    ],
    addQuestionAnswer
  );
//Updating Answers
questionRouter.put(
    '/updateAnswer',
    [
        // Sanitize the entire request body
        body('Answers.answer').escape(),
    ],
    updateAnswer)

//Getting Questions
questionRouter.get('/getAllQuestions', getAllQuestions)
questionRouter.get('/getSingleUserQuestions', getSingleUserQuestions)
questionRouter.get('/getEveryQuestions', getEveryQuestions)

// Searching for questions
questionRouter.get('/searchQuestion', searchQuestion)

// Removing
questionRouter.put('/deleteAnswer', deleteAnswer)
questionRouter.delete('/deleteQuestion', deleteQuestion)

export default questionRouter
