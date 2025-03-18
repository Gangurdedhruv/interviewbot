import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaRobot, FaPaperPlane, FaHome, FaBookmark, FaHistory, FaEllipsisH, FaChevronDown, FaChevronRight, FaMicrophone, FaMicrophoneSlash, FaCode, FaStepForward, FaEdit } from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const InterviewChatPage = () => {
  // State variables remain the same
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeSkill, setActiveSkill] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [questions, setQuestions] = useState({});
  const [generatedQuestions, setGeneratedQuestions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lastAnswerScore, setLastAnswerScore] = useState(null);
  const [keywordsToStudy, setKeywordsToStudy] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [showCodeConsole, setShowCodeConsole] = useState(false);
  const [codeValue, setCodeValue] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [currentDifficulty, setCurrentDifficulty] = useState('Basic');
  const [totalScore, setTotalScore] = useState(0);  // New state for total score
  const [answeredQuestions, setAnsweredQuestions] = useState(0);  // Track answered questions
  
  const chatEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
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
    
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = transcript;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText;
          } else {
            interimTranscript += transcriptText;
          }
        }
        
        setTranscript(finalTranscript);
        setInput(finalTranscript + interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        stopRecording();
      };
    }
    
    return () => {
      // Clean up speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Function to generate questions dynamically
  const generateQuestionsForSkill = async (skill) => {
    if (generatedQuestions[skill]) {
      return generatedQuestions[skill];
    }
    
    setIsGeneratingQuestions(true);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
      You are an expert interviewer for ${skill} positions.
      
      Please generate a set of interview questions for this skill, with:
      - 10 Basic questions (numbered 1-10)
      - 5 Intermediate questions (numbered 11-15)
      - 5 Advanced questions (numbered 16-20)
      
      Format your response exactly as follows with just the questions, no other text:
      1. [Basic question 1]
      2. [Basic question 2]
      ...
      11. [Intermediate question 1]
      ...
      16. [Advanced question 1]
      ...
      `;
      
      const result = await model.generateContent(prompt);
      const questionsText = result.response.text();
      
      const newGeneratedQuestions = {
        ...generatedQuestions,
        [skill]: questionsText
      };
      
      setGeneratedQuestions(newGeneratedQuestions);
      return questionsText;
    } catch (error) {
      console.error("Error generating questions:", error);
      // Fallback to original questions if generation fails
      return questions[skill] || "1. What is your experience with this skill?";
    } finally {
      setIsGeneratingQuestions(false);
    }
  };
  
  // When active skill changes, reset messages and create introduction
  useEffect(() => {
    if (activeSkill) {
      const loadQuestions = async () => {
        setMessages([
          {
            sender: 'bot',
            content: `Generating fresh questions for your ${activeSkill} interview preparation...`
          }
        ]);
        
        // Generate new questions for this skill
        const skillQuestions = await generateQuestionsForSkill(activeSkill);
        
        // Parse the questions into an array
        const questionItems = skillQuestions
          .split(/\d+\.\s/)
          .filter(item => item.trim().length > 0);
        
        // Determine difficulty level of first question
        setCurrentDifficulty("Basic");
        
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
        setTotalScore(0);
        setAnsweredQuestions(0);
        if (!keywordsToStudy[activeSkill]) {
          setKeywordsToStudy(prev => ({...prev, [activeSkill]: []}));
        }
      };
      
      loadQuestions();
    }
  }, [activeSkill]);
  
  // Scroll to the bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Function to toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Function to start recording
  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
      setTranscript('');
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };
  
  // Function to stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Function to edit transcript
  const toggleEditTranscript = () => {
    if (isEditingTranscript) {
      // When finished editing, update the input with the transcript
      setInput(transcript);
    }
    setIsEditingTranscript(!isEditingTranscript);
  };
  
  // Function to toggle code console
  const toggleCodeConsole = () => {
    setShowCodeConsole(!showCodeConsole);
  };
  
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
      
      // Add current score to total and increment the answered questions counter
      setTotalScore(prevTotal => prevTotal + score);
      setAnsweredQuestions(prev => prev + 1);
      
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
    
    // Stop recording if it's active
    if (isRecording) {
      stopRecording();
    }
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', content: input }]);
    
    // Add "thinking" message
    setMessages(prev => [...prev, { 
      sender: 'bot', 
      content: "Evaluating your answer...",
      isEvaluating: true
    }]);
    
    // Get current questions
    const currentSkillQuestions = generatedQuestions[activeSkill] || questions[activeSkill];
    
    // Parse the questions for current skill
    const questionItems = currentSkillQuestions
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
    
    // Move to the next question
    moveToNextQuestion();
    
    // Clear input and transcript
    setInput('');
    setTranscript('');
  };
  
  // Function to move to the next question without answering current one
  const skipQuestion = () => {
    // Add skip message
    setMessages(prev => [...prev, { 
      sender: 'user', 
      content: "[Question skipped]"
    }]);
    
    // Move to next question
    moveToNextQuestion();
    
    // Clear input and transcript
    setInput('');
    setTranscript('');
  };
  
  // Calculate normalized score out of 100
  const calculateFinalScore = () => {
    if (answeredQuestions === 0) return 0;
    return Math.round(totalScore / answeredQuestions);
  };
  
  // Common function to move to the next question
  const moveToNextQuestion = () => {
    // Get current questions
    const currentSkillQuestions = generatedQuestions[activeSkill] || questions[activeSkill];
    
    // Parse the questions for current skill
    const questionItems = currentSkillQuestions
      .split(/\d+\.\s/)
      .filter(item => item.trim().length > 0);
    
    // Determine if we should move to the next question
    const nextQuestionIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextQuestionIndex);
    
    // Update difficulty level based on question index
    let difficultyLabel = "Basic";
    if (nextQuestionIndex >= 15) {
      difficultyLabel = "Advanced";
      setCurrentDifficulty("Advanced");
    } else if (nextQuestionIndex >= 10) {
      difficultyLabel = "Intermediate";
      setCurrentDifficulty("Intermediate");
    }
    
    // Send next question or wrap up
    setTimeout(() => {
      if (nextQuestionIndex < questionItems.length) {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            content: `Let's move to a ${difficultyLabel.toLowerCase()} level question:\n\n${questionItems[nextQuestionIndex]}`
          }
        ]);
      } else {
        // Calculate final score out of 100
        const finalScore = calculateFinalScore();
        
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            content: `You've completed all the ${activeSkill} questions!\n\nYour final score is: ${finalScore}/100 (answered ${answeredQuestions} of 20 questions).\n\nHere are the key concepts you should review: ${keywordsToStudy[activeSkill].join(', ')}`
          }
        ]);
      }
    }, 500);
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
            <h5 className="m-0 fw-bold" style={{ color: '#7209b7' }}>PrepNexus</h5>
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
            <p className="text-secondary small m-0">
              Practice answering {currentDifficulty.toLowerCase()} interview questions
              {currentQuestionIndex > 0 && ` - Question ${currentQuestionIndex + 1}/20`}
            </p>
          </div>
          <div className="me-2">
            {answeredQuestions > 0 && (
              <div className={`badge ${getScoreBadgeColor(calculateFinalScore())} py-2 px-3`}>
                Current Score: {calculateFinalScore()}/100
              </div>
            )}
          </div>
          <div>
            <button 
              className="btn btn-sm btn-outline-primary me-2" 
              onClick={toggleCodeConsole}
              title="Open code console"
            >
              <FaCode />
            </button>
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
        
        {/* Code Console */}
        {showCodeConsole && (
          <div className="bg-dark p-3 border-top" style={{ height: '300px' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <select 
                  className="form-select form-select-sm" 
                  value={codeLanguage} 
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                </select>
              </div>
              <button 
                className="btn btn-sm btn-outline-light" 
                onClick={toggleCodeConsole}
              >
                Close Console
              </button>
            </div>
            <AceEditor
              mode={codeLanguage}
              theme="monokai"
              name="code-editor"
              onChange={setCodeValue}
              value={codeValue}
              width="100%"
              height="220px"
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </div>
        )}
        
        {/* Transcript editing area */}
        {isEditingTranscript && (
          <div className="bg-white p-3 border-top">
            <div className="d-flex align-items-center mb-2">
              <h6 className="m-0 me-2">Edit Transcript</h6>
              <button 
                className="btn btn-sm btn-outline-success" 
                onClick={toggleEditTranscript}
              >
                Save Changes
              </button>
            </div>
            <textarea
              className="form-control"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows="3"
              style={{ resize: 'none', borderRadius: '8px' }}
            />
          </div>
        )}
        
        {/* Input area */}
        <div className="bg-white p-3 border-top">
          <div className="d-flex mb-2">
            <textarea
              className="form-control me-2"
              placeholder={isRecording ? "Listening..." : "Type your answer or press the microphone to speak..."} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows="2"
              style={{ resize: 'none', borderRadius: '8px' }}
              disabled={isEvaluating}
            />
            <div className="d-flex flex-column">
              <button 
                className={`btn ${isRecording ? 'btn-danger' : 'btn-outline-secondary'} mb-1`}
                onClick={toggleRecording}
                title={isRecording ? "Stop recording" : "Start recording"}
                disabled={isEvaluating}
              >
                {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
              
              <button 
                className="btn btn-primary px-3" 
                onClick={handleSend}
                disabled={!input.trim() || isEvaluating}
                style={{ backgroundColor: '#7209b7', borderColor: '#7209b7' }}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
          
          <div className="d-flex justify-content-between">
            <div>
              <button 
                className="btn btn-sm btn-outline-primary me-2"
                onClick={toggleEditTranscript}
                disabled={isRecording || isEvaluating || !input.trim()}
              >
                <FaEdit className="me-1" /> Edit Transcript
              </button>
              
              <button 
                className="btn btn-sm btn-outline-warning"
                onClick={skipQuestion}
                disabled={isEvaluating}
              >
                <FaStepForward className="me-1" /> Skip Question
              </button>
            </div>
            
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