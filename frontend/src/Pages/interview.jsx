// import React, { useState, useRef, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { FaUser, FaRobot, FaPaperPlane, FaHome, FaBookmark, FaHistory, FaEllipsisH, FaChevronDown, FaChevronRight } from 'react-icons/fa';

// const InterviewChatPage = ({ questions = {} }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [activeSkill, setActiveSkill] = useState('');
//   const [showSidebar, setShowSidebar] = useState(true);
//   const chatEndRef = useRef(null);
  
//   useEffect(() => {
//     // If questions are provided and there's an active skill, initialize the chat
//     if (Object.keys(questions).length > 0 && !activeSkill) {
//       // Set the first skill as active
//       const firstSkill = Object.keys(questions)[0];
//       setActiveSkill(firstSkill);
      
//       // Add welcome message
//       setMessages([
//         {
//           sender: 'bot',
//           content: `Welcome to your interview preparation for ${firstSkill}! I'll be asking you questions to help you practice. Let me know when you're ready to begin.`
//         }
//       ]);
//     }
//   }, [questions]);
  
//   useEffect(() => {
//     // When active skill changes, reset messages and create introduction
//     if (activeSkill && questions[activeSkill]) {
//       // Parse the questions into an array
//       const questionItems = questions[activeSkill]
//         .split(/\d+\.\s/)
//         .filter(item => item.trim().length > 0);
      
//       // Initialize the chat with welcome message and first question
//       setMessages([
//         {
//           sender: 'bot',
//           content: `Let's practice ${activeSkill} interview questions. I'll present each question one by one.`
//         },
//         {
//           sender: 'bot',
//           content: questionItems[0]
//         }
//       ]);
//     }
//   }, [activeSkill]);
  
//   useEffect(() => {
//     // Scroll to the bottom when messages change
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);
  
//   const handleSend = () => {
//     if (!input.trim()) return;
    
//     // Add user message
//     setMessages(prev => [...prev, { sender: 'user', content: input }]);
    
//     // Parse the questions for current skill
//     const questionItems = questions[activeSkill]
//       .split(/\d+\.\s/)
//       .filter(item => item.trim().length > 0);
    
//     // Find which question we're on based on message count
//     const userResponseCount = messages.filter(m => m.sender === 'user').length;
    
//     // Send next question or wrap up
//     setTimeout(() => {
//       if (userResponseCount + 1 < questionItems.length) {
//         setMessages(prev => [
//           ...prev, 
//           { 
//             sender: 'bot', 
//             content: questionItems[userResponseCount + 1]
//           }
//         ]);
//       } else if (userResponseCount + 1 === questionItems.length) {
//         setMessages(prev => [
//           ...prev, 
//           { 
//             sender: 'bot', 
//             content: `Great job completing all the ${activeSkill} questions! Would you like to practice another skill or review your answers?`
//           }
//         ]);
//       }
//     }, 1000);
    
//     setInput('');
//   };
  
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };
  
//   return (
//     <div className="vh-100 d-flex bg-light">
//       {/* Sidebar */}
//       {showSidebar && (
//         <div className="bg-white border-end d-flex flex-column" style={{ width: '260px', transition: 'width 0.3s ease' }}>
//           <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
//             <h5 className="m-0 fw-bold" style={{ color: '#7209b7' }}>Interview Bot</h5>
//             <button 
//               className="btn btn-sm btn-outline-secondary border-0" 
//               onClick={() => setShowSidebar(false)}
//             >
//               <FaChevronLeft />
//             </button>
//           </div>
          
//           <div className="p-3">
//             <button 
//               className="btn btn-primary w-100 mb-3" 
//               style={{ backgroundColor: '#7209b7', borderColor: '#7209b7' }}
//               onClick={() => window.location.href = '/'}
//             >
//               <FaHome className="me-2" /> Back to Dashboard
//             </button>
//           </div>
          
//           <div className="flex-grow-1 overflow-auto">
//             <div className="p-3">
//               <p className="text-secondary small fw-medium mb-2">MY SKILLS</p>
//               {Object.keys(questions).map((skill) => (
//                 <div 
//                   key={skill}
//                   className={`p-2 rounded mb-1 d-flex align-items-center cursor-pointer ${activeSkill === skill ? 'bg-light fw-medium' : ''}`}
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => setActiveSkill(skill)}
//                 >
//                   {activeSkill === skill ? <FaChevronRight className="me-2 text-primary" size={12} /> : <span className="me-3" />}
//                   {skill}
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div className="p-3 border-top">
//             <div className="d-flex justify-content-around">
//               <button className="btn btn-sm btn-outline-secondary border-0">
//                 <FaBookmark />
//               </button>
//               <button className="btn btn-sm btn-outline-secondary border-0">
//                 <FaHistory />
//               </button>
//               <button className="btn btn-sm btn-outline-secondary border-0">
//                 <FaEllipsisH />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Main chat area */}
//       <div className="flex-grow-1 d-flex flex-column">
//         {/* Chat header */}
//         <div className="bg-white border-bottom p-3 d-flex align-items-center">
//           {!showSidebar && (
//             <button 
//               className="btn btn-sm btn-outline-secondary border-0 me-3" 
//               onClick={() => setShowSidebar(true)}
//             >
//               <FaChevronRight />
//             </button>
//           )}
//           <div>
//             <h5 className="m-0">{activeSkill || 'Interview Practice'}</h5>
//             <p className="text-secondary small m-0">Practice answering interview questions</p>
//           </div>
//         </div>
        
//         {/* Chat messages */}
//         <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
//           {messages.map((message, index) => (
//             <div key={index} className={`d-flex mb-4 ${message.sender === 'user' ? 'justify-content-end' : ''}`}>
//               {message.sender === 'bot' && (
//                 <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', backgroundColor: '#7209b7' }}>
//                   <FaRobot className="text-white" />
//                 </div>
//               )}
//               <div 
//                 className={`p-3 rounded-3 ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-white border'}`}
//                 style={{ 
//                   maxWidth: '80%', 
//                   backgroundColor: message.sender === 'user' ? '#7209b7' : '#fff',
//                   boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//                 }}
//               >
//                 <p className="m-0" style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
//               </div>
//               {message.sender === 'user' && (
//                 <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center ms-3" style={{ width: '40px', height: '40px' }}>
//                   <FaUser className="text-white" />
//                 </div>
//               )}
//             </div>
//           ))}
//           <div ref={chatEndRef} />
//         </div>
        
//         {/* Input area */}
//         <div className="bg-white p-3 border-top">
//           <div className="d-flex">
//             <textarea
//               className="form-control me-2"
//               placeholder="Type your answer..." 
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               rows="2"
//               style={{ resize: 'none', borderRadius: '8px' }}
//             />
//             <button 
//               className="btn btn-primary px-4" 
//               onClick={handleSend}
//               disabled={!input.trim()}
//               style={{ backgroundColor: '#7209b7', borderColor: '#7209b7', alignSelf: 'flex-end' }}
//             >
//               <FaPaperPlane />
//             </button>
//           </div>
//           <div className="text-center mt-2">
//             <small className="text-secondary">Press Enter to send, Shift+Enter for a new line</small>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FaChevronLeft = () => {
//   // This is just a custom component to avoid importing a non-specified icon
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//       <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
//     </svg>
//   );
// };

// export default InterviewChatPage;

import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaRobot, FaPaperPlane, FaHome, FaBookmark, FaHistory, FaEllipsisH, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const InterviewChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeSkill, setActiveSkill] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [questions, setQuestions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lastAnswerScore, setLastAnswerScore] = useState(null);
  const [keywordsToStudy, setKeywordsToStudy] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Load questions from sessionStorage on component mount
  useEffect(() => {
    const storedQuestions = sessionStorage.getItem('interviewQuestions');
    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions);
      setQuestions(parsedQuestions);
      
      // Set the first skill as active if we have questions
      if (Object.keys(parsedQuestions).length > 0) {
        setActiveSkill(Object.keys(parsedQuestions)[0]);
      }
    } else {
      // If no questions found, add a message prompting to go back to home page
      setMessages([
        {
          sender: 'bot',
          content: "It looks like you haven't generated any interview questions yet. Please go back to the dashboard to select a skill or upload your resume."
        }
      ]);
    }
  }, []);
  
  // When active skill changes, reset messages and create introduction
  useEffect(() => {
    if (activeSkill && questions[activeSkill]) {
      // Parse the questions into an array
      const questionItems = questions[activeSkill]
        .split(/\d+\.\s/)
        .filter(item => item.trim().length > 0);
      
      // Initialize the chat with welcome message and first question
      setMessages([
        {
          sender: 'bot',
          content: `Welcome to your ${activeSkill} interview preparation! We'll start with basic questions and progressively move to more advanced topics.`
        },
        {
          sender: 'bot',
          content: questionItems[0]
        }
      ]);
      
      // Reset question index and keywords for the new skill
      setCurrentQuestionIndex(0);
      if (!keywordsToStudy[activeSkill]) {
        setKeywordsToStudy(prev => ({...prev, [activeSkill]: []}));
      }
    }
  }, [activeSkill]);
  
  // Scroll to the bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Function to evaluate the user's answer
  const evaluateAnswer = async (question, answer, skillName) => {
    setIsEvaluating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
      You are an expert interviewer for ${skillName} positions.
      
      Question: ${question}
      Candidate's Answer: ${answer}
      
      Please evaluate this answer on a scale of 1-100 and provide:
      1. A score from 1-100
      2. Brief feedback (2-3 sentences)
      3. 3-5 key technical terms the candidate should know better based on this answer
      
      Format your response exactly as follows:
      SCORE: [numerical score only]
      FEEDBACK: [your feedback]
      KEYWORDS: [comma-separated list of technical terms]
      `;
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Extract score, feedback and keywords using regex
      const scoreMatch = responseText.match(/SCORE:\s*(\d+)/i);
      const feedbackMatch = responseText.match(/FEEDBACK:\s*(.*?)(?=KEYWORDS:|$)/is);
      const keywordsMatch = responseText.match(/KEYWORDS:\s*(.*?)$/is);
      
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : "Good effort, but there's room for improvement.";
      const keywordsList = keywordsMatch ? 
        keywordsMatch[1].split(',').map(k => k.trim()).filter(k => k) : 
        ["concept 1", "concept 2"];
      
      // Update keywords to study for this skill
      setKeywordsToStudy(prev => ({
        ...prev,
        [skillName]: [...new Set([...(prev[skillName] || []), ...keywordsList])]
      }));
      
      return { score, feedback, keywordsList };
    } catch (error) {
      console.error("Error evaluating answer:", error);
      return { 
        score: 75, 
        feedback: "I couldn't properly evaluate your answer, but it contains some good points.", 
        keywordsList: ["error in evaluation"] 
      };
    } finally {
      setIsEvaluating(false);
    }
  };
  
  const handleSend = async () => {
    if (!input.trim() || isEvaluating) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', content: input }]);
    
    // Add "thinking" message
    setMessages(prev => [...prev, { 
      sender: 'bot', 
      content: "Evaluating your answer...",
      isEvaluating: true
    }]);
    
    // Parse the questions for current skill
    const questionItems = questions[activeSkill]
      .split(/\d+\.\s/)
      .filter(item => item.trim().length > 0);
    
    // Get current question
    const currentQuestion = questionItems[currentQuestionIndex];
    
    // Evaluate the answer
    const evaluation = await evaluateAnswer(currentQuestion, input, activeSkill);
    setLastAnswerScore(evaluation.score);
    
    // Remove the "thinking" message
    setMessages(prev => prev.filter(msg => !msg.isEvaluating));
    
    // Add evaluation feedback
    setMessages(prev => [...prev, { 
      sender: 'bot', 
      content: `Score: ${evaluation.score}/100\n\n${evaluation.feedback}\n\nKey concepts to review: ${evaluation.keywordsList.join(', ')}`
    }]);
    
    // Determine if we should move to the next question
    const nextQuestionIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextQuestionIndex);
    
    // Send next question or wrap up
    setTimeout(() => {
      if (nextQuestionIndex < questionItems.length) {
        // Add difficulty level indicator based on question index
        let difficultyLabel = "Basic";
        if (nextQuestionIndex >= questionItems.length - 1) {
          difficultyLabel = "Advanced";
        } else if (nextQuestionIndex > 1) {
          difficultyLabel = "Intermediate";
        }
        
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            content: `Let's move to a ${difficultyLabel.toLowerCase()} level question:\n\n${questionItems[nextQuestionIndex]}`
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            content: `You've completed all the ${activeSkill} questions! Here are the key concepts you should review: ${keywordsToStudy[activeSkill].join(', ')}\n\nWould you like to practice another skill?`
          }
        ]);
      }
    }, 1000);
    
    setInput('');
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleGoToDashboard = () => {
    navigate('/homepage');
  };
  
  return (
    <div className="vh-100 d-flex bg-light">
      {/* Sidebar */}
      {showSidebar && (
        <div className="bg-white border-end d-flex flex-column" style={{ width: '260px', transition: 'width 0.3s ease' }}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="m-0 fw-bold" style={{ color: '#7209b7' }}>Interview Bot</h5>
            <button 
              className="btn btn-sm btn-outline-secondary border-0" 
              onClick={() => setShowSidebar(false)}
            >
              <FaChevronLeft />
            </button>
          </div>
          
          <div className="p-3">
            <button 
              className="btn btn-primary w-100 mb-3" 
              style={{ backgroundColor: '#7209b7', borderColor: '#7209b7' }}
              onClick={handleGoToDashboard}
            >
              <FaHome className="me-2" /> Back to Dashboard
            </button>
          </div>
          
          <div className="flex-grow-1 overflow-auto">
            <div className="p-3">
              <p className="text-secondary small fw-medium mb-2">MY SKILLS</p>
              {Object.keys(questions).map((skill) => (
                <div 
                  key={skill}
                  className={`p-2 rounded mb-1 d-flex align-items-center cursor-pointer ${activeSkill === skill ? 'bg-light fw-medium' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveSkill(skill)}
                >
                  {activeSkill === skill ? <FaChevronRight className="me-2 text-primary" size={12} /> : <span className="me-3" />}
                  {skill}
                </div>
              ))}
            </div>
            
            {/* Keywords to Study Section */}
            {keywordsToStudy[activeSkill] && keywordsToStudy[activeSkill].length > 0 && (
              <div className="p-3 border-top">
                <p className="text-secondary small fw-medium mb-2">CONCEPTS TO REVIEW</p>
                <div className="d-flex flex-wrap gap-1">
                  {keywordsToStudy[activeSkill].map((keyword, idx) => (
                    <span key={idx} className="badge bg-info text-dark rounded-pill py-1 px-2 mb-1">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 border-top">
            <div className="d-flex justify-content-around">
              <button className="btn btn-sm btn-outline-secondary border-0">
                <FaBookmark />
              </button>
              <button className="btn btn-sm btn-outline-secondary border-0">
                <FaHistory />
              </button>
              <button className="btn btn-sm btn-outline-secondary border-0">
                <FaEllipsisH />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main chat area */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Chat header */}
        <div className="bg-white border-bottom p-3 d-flex align-items-center">
          {!showSidebar && (
            <button 
              className="btn btn-sm btn-outline-secondary border-0 me-3" 
              onClick={() => setShowSidebar(true)}
            >
              <FaChevronRight />
            </button>
          )}
          <div className="flex-grow-1">
            <h5 className="m-0">{activeSkill || 'Interview Practice'}</h5>
            <p className="text-secondary small m-0">Practice answering interview questions</p>
          </div>
          {lastAnswerScore !== null && (
            <div className={`badge ${getScoreBadgeColor(lastAnswerScore)} py-2 px-3`}>
              Last Score: {lastAnswerScore}/100
            </div>
          )}
        </div>
        
        {/* Chat messages */}
        <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          {messages.map((message, index) => (
            <div key={index} className={`d-flex mb-4 ${message.sender === 'user' ? 'justify-content-end' : ''}`}>
              {message.sender === 'bot' && (
                <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', backgroundColor: '#7209b7' }}>
                  <FaRobot className="text-white" />
                </div>
              )}
              <div 
                className={`p-3 rounded-3 ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-white border'}`}
                style={{ 
                  maxWidth: '80%', 
                  backgroundColor: message.sender === 'user' ? '#7209b7' : '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <p className="m-0" style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
              </div>
              {message.sender === 'user' && (
                <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center ms-3" style={{ width: '40px', height: '40px' }}>
                  <FaUser className="text-white" />
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        {/* Input area */}
        <div className="bg-white p-3 border-top">
          <div className="d-flex">
            <textarea
              className="form-control me-2"
              placeholder="Type your answer..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows="2"
              style={{ resize: 'none', borderRadius: '8px' }}
              disabled={isEvaluating}
            />
            <button 
              className="btn btn-primary px-4" 
              onClick={handleSend}
              disabled={!input.trim() || isEvaluating}
              style={{ backgroundColor: '#7209b7', borderColor: '#7209b7', alignSelf: 'flex-end' }}
            >
              <FaPaperPlane />
            </button>
          </div>
          <div className="text-center mt-2">
            <small className="text-secondary">Press Enter to send, Shift+Enter for a new line</small>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine badge color based on score
const getScoreBadgeColor = (score) => {
  if (score >= 90) return 'bg-success text-white';
  if (score >= 70) return 'bg-primary text-white';
  if (score >= 50) return 'bg-warning text-dark';
  return 'bg-danger text-white';
};

const FaChevronLeft = () => {
  // This is just a custom component to avoid importing a non-specified icon
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  );
};

export default InterviewChatPage;