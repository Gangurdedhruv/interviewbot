import FamousQuestions from '../models/famousQuestions.js';

// Extract company from question title or set a default
const extractCompanyFromTitle = (title) => {
  // List of common tech companies to check for
  const companies = [
    'Google', 'Amazon', 'Facebook', 'Meta', 'Microsoft', 'Apple', 
    'Netflix', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'Adobe', 
    'Oracle', 'IBM', 'Salesforce', 'Tesla', 'Spotify', 'Dropbox'
  ];
  
  // Check if any company name appears in the title
  for (const company of companies) {
    if (title.includes(company)) {
      return company;
    }
  }
  
  return 'General'; // Default company if no match found
};

// Get all famous questions
export const getAllFamousQuestions = async (req, res) => {
  try {
    const questions = await FamousQuestions.find({});
    
    // Add company field to each question based on title
    const processedQuestions = questions.map(question => {
      const questionObj = question.toObject();
      
      // Process each title to extract company info
      const titles = Array.isArray(questionObj.Title) ? questionObj.Title : [questionObj.Title];
      
      // Assign a company to each question
      questionObj.companies = titles.map(title => extractCompanyFromTitle(title || ''));
      
      return questionObj;
    });
    
    return res.status(200).json({
      success: true,
      data: processedQuestions
    });
  } catch (err) {
    console.error('Error fetching famous questions:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch interview questions'
    });
  }
};

// Get question by ID
export const getFamousQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await FamousQuestions.findById(id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Add company info
    const questionObj = question.toObject();
    const titles = Array.isArray(questionObj.Title) ? questionObj.Title : [questionObj.Title];
    questionObj.companies = titles.map(title => extractCompanyFromTitle(title || ''));
    
    return res.status(200).json({
      success: true,
      data: questionObj
    });
  } catch (err) {
    console.error('Error fetching question by ID:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch question'
    });
  }
};

// Get questions by company
export const getFamousQuestionsByCompany = async (req, res) => {
  try {
    const { company } = req.params;
    const allQuestions = await FamousQuestions.find({});
    
    // Filter questions by company manually since we don't have a company field
    const companyQuestions = allQuestions.filter(question => {
      const titles = Array.isArray(question.Title) ? question.Title : [question.Title];
      return titles.some(title => 
        (title && title.includes(company)) || 
        extractCompanyFromTitle(title || '') === company
      );
    });
    
    // Add company field to each question
    const processedQuestions = companyQuestions.map(question => {
      const questionObj = question.toObject();
      const titles = Array.isArray(questionObj.Title) ? questionObj.Title : [questionObj.Title];
      questionObj.companies = titles.map(title => extractCompanyFromTitle(title || ''));
      return questionObj;
    });
    
    return res.status(200).json({
      success: true,
      data: processedQuestions
    });
  } catch (err) {
    console.error('Error fetching company questions:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch questions for this company'
    });
  }
};

// Get questions by difficulty
export const getFamousQuestionsByDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.params;
    const questions = await FamousQuestions.find({
      Difficulty: { $in: [difficulty] }
    });
    
    // Add company field to each question
    const processedQuestions = questions.map(question => {
      const questionObj = question.toObject();
      const titles = Array.isArray(questionObj.Title) ? questionObj.Title : [questionObj.Title];
      questionObj.companies = titles.map(title => extractCompanyFromTitle(title || ''));
      return questionObj;
    });
    
    return res.status(200).json({
      success: true,
      data: processedQuestions
    });
  } catch (err) {
    console.error('Error fetching difficulty questions:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch questions for this difficulty level'
    });
  }
};

// Search questions
export const searchFamousQuestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }
    
    // Search in title, question, and description fields
    const questions = await FamousQuestions.find({
      $or: [
        { Title: { $regex: q, $options: 'i' } },
        { Question: { $regex: q, $options: 'i' } },
        { Description: { $regex: q, $options: 'i' } }
      ]
    });
    
    // Add company field to each question
    const processedQuestions = questions.map(question => {
      const questionObj = question.toObject();
      const titles = Array.isArray(questionObj.Title) ? questionObj.Title : [questionObj.Title];
      questionObj.companies = titles.map(title => extractCompanyFromTitle(title || ''));
      return questionObj;
    });
    
    return res.status(200).json({
      success: true,
      data: processedQuestions
    });
  } catch (err) {
    console.error('Error searching questions:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to search questions'
    });
  }
};