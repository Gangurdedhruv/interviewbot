import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronRight, FaFilter, FaSearch } from 'react-icons/fa';
import { getAllFamousQuestions, getFamousQuestionsByCompany, getFamousQuestionsByDifficulty, searchFamousQuestions } from '../actions/questionsActions.js'; 

const FamousInterviewQuestions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [toasts, setToasts] = useState([]);

  // Custom toast function
  const showToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, title, message, type }]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        let response;
        
        if (searchTerm) {
          response = await searchFamousQuestions(searchTerm);
        } else if (difficultyFilter !== 'all') {
          response = await getFamousQuestionsByDifficulty(difficultyFilter);
        } else {
          response = await getAllFamousQuestions();
        }
        
        if (response.success) {
          // Organize questions by company
          const organized = organizeByCompany(response.data);
          setQuestions(organized);
        } else {
          showToast('Error', response.message || 'Failed to load questions', 'danger');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching interview questions:', error);
        showToast('Error', 'Failed to load interview questions', 'danger');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [searchTerm, difficultyFilter]);

  // Function to organize questions by company
  // Function to organize questions by company
// Function to organize questions by company
const organizeByCompany = (data) => {
  const companyGroups = {};
  
  if (data && data.length > 0) {
    data.forEach(question => {
      // Parse the Title array to get questions
      const titles = Array.isArray(question.Title) ? question.Title : [question.Title];
      const questions = Array.isArray(question.Question) ? question.Question : [question.Question];
      const descriptions = Array.isArray(question.Description) ? question.Description : [question.Description];
      const examples = Array.isArray(question.Example) ? question.Example : [question.Example];
      const constraints = Array.isArray(question.Constraint) ? question.Constraint : [question.Constraint];
      const difficulties = Array.isArray(question.Difficulty) ? question.Difficulty : [question.Difficulty];
      const companyNames = Array.isArray(question.companies) ? question.companies : ['General'];
      
      // Process each question
      for (let i = 0; i < titles.length; i++) {
        // Get the company from the processed data
        const company = companyNames[i] || 'General';
        
        if (!companyGroups[company]) {
          companyGroups[company] = [];
        }
        
        companyGroups[company].push({
          _id: `${question._id}-${i}`, // Create unique ID for each question
          title: titles[i] || '',
          question: questions[i] || '',
          description: descriptions[i] || '',
          example: examples[i] || '',
          constraint: constraints[i] || '',
          difficulty: difficulties[i] || '',
          company: company
        });
      }
    });
  }
  
  return Object.entries(companyGroups).map(([name, questions]) => ({
    name,
    questions
  }));
};

  const toggleCompany = (companyName) => {
    if (expandedCompany === companyName) {
      setExpandedCompany(null);
    } else {
      setExpandedCompany(companyName);
    }
    // Reset expanded question when toggling companies
    setExpandedQuestion(null);
  };

  const toggleQuestion = (questionId) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(questionId);
    }
  };

  const handleGoBack = () => {
    navigate('/homepage');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is handled by the useEffect
  };

  // Filter functions
  const getDifficultyClass = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'hard':
        return 'text-danger';
      default:
        return 'text-secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <div className="container py-5">
          <div className="card">
            <div className="card-body text-center p-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem', color: '#7209b7' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading interview questions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Toast Container */}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {toasts.map(toast => (
          <div key={toast.id} className={`toast show bg-${toast.type} text-white`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">{toast.title}</strong>
              <button type="button" className="btn-close" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}></button>
            </div>
            <div className="toast-body">
              {toast.message}
            </div>
          </div>
        ))}
      </div>

      <div className="container py-4">
        <div className="d-flex flex-column gap-4">
          {/* Back Button */}
          <button 
            className="btn btn-sm btn-outline-secondary align-self-start mb-2" 
            onClick={handleGoBack}
          >
            <FaArrowLeft className="me-2" /> Back to HomePage
          </button>

          {/* Search and Filter */}
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Famous Interview Questions</h2>
              
              <div className="row g-3">
                <div className="col-md-8">
                  <form onSubmit={handleSearch}>
                    <div className="input-group">
                      <span className="input-group-text"><FaSearch /></span>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search questions..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#7209b7', borderColor: '#7209b7' }}>Search</button>
                    </div>
                  </form>
                </div>
                
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text"><FaFilter /></span>
                    <select 
                      className="form-select" 
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* No Results */}
          {questions.length === 0 && (
            <div className="card">
              <div className="card-body text-center p-5">
                <p className="mb-0">No questions match your search criteria.</p>
              </div>
            </div>
          )}

          {/* Companies and Questions */}
          {questions.map((company) => (
            <div className="card mb-3" key={company.name}>
              <div 
                className="card-header d-flex justify-content-between align-items-center"
                onClick={() => toggleCompany(company.name)}
                style={{ cursor: 'pointer' }}
              >
                <h3 className="h5 mb-0">{company.name} <span className="badge bg-light text-dark ms-2">{company.questions.length}</span></h3>
                {expandedCompany === company.name ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              
              {expandedCompany === company.name && (
                <div className="list-group list-group-flush">
                  {company.questions.map((question) => (
                    <div key={question._id} className="list-group-item">
                      <div 
                        className="d-flex justify-content-between align-items-center py-2"
                        onClick={() => toggleQuestion(question._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div>
                          <h4 className="h6 mb-0">{question.title}</h4>
                          <span className={`small ${getDifficultyClass(question.difficulty)}`}>
                            {question.difficulty || 'N/A'}
                          </span>
                        </div>
                        {expandedQuestion === question._id ? <FaChevronDown /> : <FaChevronRight />}
                      </div>
                      
                      {expandedQuestion === question._id && (
                        <div className="mt-3 ms-3">
                          <div className="mb-3">
                            <h5 className="h6 text-secondary">Problem:</h5>
                            <p>{question.question}</p>
                          </div>
                          
                          {question.description && (
                            <div className="mb-3">
                              <h5 className="h6 text-secondary">Description:</h5>
                              <p>{question.description}</p>
                            </div>
                          )}
                          
                          {question.example && (
                            <div className="mb-3">
                              <h5 className="h6 text-secondary">Example:</h5>
                              <pre className="bg-light p-3 rounded"><code>{question.example}</code></pre>
                            </div>
                          )}
                          
                          {question.constraint && (
                            <div className="mb-3">
                              <h5 className="h6 text-secondary">Constraints:</h5>
                              <p>{question.constraint}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamousInterviewQuestions;