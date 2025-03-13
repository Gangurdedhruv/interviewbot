import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaRobot, FaPaperPlane, FaHome, FaBookmark, FaHistory, FaEllipsisH, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const InterviewChatPage = ({ questions = {} }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeSkill, setActiveSkill] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    // If questions are provided and there's an active skill, initialize the chat
    if (Object.keys(questions).length > 0 && !activeSkill) {
      // Set the first skill as active
      const firstSkill = Object.keys(questions)[0];
      setActiveSkill(firstSkill);
      
      // Add welcome message
      setMessages([
        {
          sender: 'bot',
          content: `Welcome to your interview preparation for ${firstSkill}! I'll be asking you questions to help you practice. Let me know when you're ready to begin.`
        }
      ]);
    }
  }, [questions]);
  
  useEffect(() => {
    // When active skill changes, reset messages and create introduction
    if (activeSkill && questions[activeSkill]) {
      // Parse the questions into an array
      const questionItems = questions[activeSkill]
        .split(/\d+\.\s/)
        .filter(item => item.trim().length > 0);
      
      // Initialize the chat with welcome message and first question
      setMessages([
        {
          sender: 'bot',
          content: `Let's practice ${activeSkill} interview questions. I'll present each question one by one.`
        },
        {
          sender: 'bot',
          content: questionItems[0]
        }
      ]);
    }
  }, [activeSkill]);
  
  useEffect(() => {
    // Scroll to the bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', content: input }]);
    
    // Parse the questions for current skill
    const questionItems = questions[activeSkill]
      .split(/\d+\.\s/)
      .filter(item => item.trim().length > 0);
    
    // Find which question we're on based on message count
    const userResponseCount = messages.filter(m => m.sender === 'user').length;
    
    // Send next question or wrap up
    setTimeout(() => {
      if (userResponseCount + 1 < questionItems.length) {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            content: questionItems[userResponseCount + 1]
          }
        ]);
      } else if (userResponseCount + 1 === questionItems.length) {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            content: `Great job completing all the ${activeSkill} questions! Would you like to practice another skill or review your answers?`
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
              onClick={() => window.location.href = '/'}
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
          <div>
            <h5 className="m-0">{activeSkill || 'Interview Practice'}</h5>
            <p className="text-secondary small m-0">Practice answering interview questions</p>
          </div>
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
            />
            <button 
              className="btn btn-primary px-4" 
              onClick={handleSend}
              disabled={!input.trim()}
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

const FaChevronLeft = () => {
  // This is just a custom component to avoid importing a non-specified icon
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  );
};

export default InterviewChatPage;