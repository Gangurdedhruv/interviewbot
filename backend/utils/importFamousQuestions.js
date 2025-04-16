import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FamousQuestions from '../models/famousQuestions.js';

dotenv.config({
    path: "../../.env"
});

// Connect to MongoDB
try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure if there's an error
}

// Read JSON data
const jsonData = JSON.parse(fs.readFileSync('./dummyData/famousInterviewQuestions.json'))

// Initialize arrays to hold all questions data
let allTitles = [];
let allQuestions = [];
let allDescriptions = [];
let allExamples = [];
let allConstraints = [];
let allDifficulties = [];

// Process Meta section
try {
    if (jsonData.Meta && jsonData.Meta.length > 0) {
        jsonData.Meta.forEach(metaArray => {
            if (Array.isArray(metaArray)) {
                metaArray.forEach(question => {
                    allTitles.push(question.title || '');
                    allQuestions.push(question.question || '');
                    allDescriptions.push(question.description || '');
                    allExamples.push(question.example || '');
                    allConstraints.push(question.constraint || '');
                    allDifficulties.push(question.difficulty || '');
                });
            }
        });
    }
    
    // Process company-specific sections
    const companies = ['Meta','Google', 'Microsoft', 'Netflix', 'Flipkart','linkedn'];
    companies.forEach(company => {
        if (jsonData[company] && jsonData[company].length > 0) {
            jsonData[company].forEach(question => {
                allTitles.push(question.title || '');
                allQuestions.push(question.question || '');
                allDescriptions.push(question.description || '');
                allExamples.push(question.example || '');
                allConstraints.push(question.constraint || '');
                allDifficulties.push(question.difficulty || '');
            });
        }
    });
    
    // Process general problems section
    if (jsonData.problems && jsonData.problems.length > 0) {
        jsonData.problems.forEach(problem => {
            allTitles.push(problem.title || '');
            allQuestions.push(problem.question || '');
            allDescriptions.push(problem.description || '');
            allExamples.push(problem.example || '');
            allConstraints.push(problem.constraint || '');
            allDifficulties.push(problem.difficulty || '');
        });
    }
    
    // Create data object matching schema
    const interviewQuestions = {
        Title: allTitles,
        Question: allQuestions,
        Description: allDescriptions,
        Example: allExamples,
        Constraint: allConstraints,
        Difficulty: allDifficulties
    };
    
    // Save to database
    const result = await FamousQuestions.create(interviewQuestions);
    
    console.log(`Imported data: ${allTitles.length} interview questions`);
} catch (err) {
    console.error(`Error importing data: ${err}`);
} finally {
    mongoose.disconnect();
    process.exit(0);
}