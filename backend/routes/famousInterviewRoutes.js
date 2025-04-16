import express from 'express';
import { 
    getAllFamousQuestions, 
    getFamousQuestionById, 
    getFamousQuestionsByCompany, 
    getFamousQuestionsByDifficulty,
    searchFamousQuestions
} from '../controllers/famousInterviewCtrls.js';

const router = express.Router();

// Public routes for viewing questions
router.get('/get-all-famous-questions', getAllFamousQuestions);
router.get('/get-famous-question-by-id/:id', getFamousQuestionById);
router.get('/get-famous-questions-by-company/:company', getFamousQuestionsByCompany);
router.get('/get-famous-questions-by-difficulty/:difficulty', getFamousQuestionsByDifficulty);
router.get('/search-famous-questions', searchFamousQuestions);

export default router;