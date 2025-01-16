//AIzaSyDSpnVFPJz0oX9HyJKOrz1Tl74fObqSPrI


import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI("AIzaSyDSpnVFPJz0oX9HyJKOrz1Tl74fObqSPrI");  // Replace with your API key

// Async function to generate questions for multiple subjects
async function generateInterviewQuestions(subjectArray) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Loop through each subject and generate questions
    for (const subject of subjectArray) {
        const prompt = `Generate 5 interview questions for the subject: ${subject}`;
        
        try {
            const result = await model.generateContent(prompt);
            console.log(`\n📚 Interview Questions for ${subject}:\n`);
            console.log(result.response.text());
        } catch (error) {
            console.error(`❌ Error generating questions for ${subject}:`, error);
        }
    }
}

// Example subjects array
const subjects = ["Python", "Data Structures", "Algorithms"];

// Call the function with the subjects array
generateInterviewQuestions(subjects);
