//   import React, { useEffect, useState } from 'react';
//   //import 'bootstrap/dist/css/bootstrap.min.css';
//   import { FaFileUpload, FaPlay, FaUser, FaClipboard, FaUsers, FaCreditCard, FaTimes } from 'react-icons/fa';
//   import * as pdfjs from 'pdfjs-dist/webpack';
//   import { GoogleGenerativeAI } from "@google/generative-ai";
// import { useNavigate } from 'react-router-dom';

//   // Initialize Google Generative AI
//   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

//   const HomePage = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [fileName, setFileName] = useState('');
//     const [keywords, setKeywords] = useState([]);
//     const [selectedSubject, setSelectedSubject] = useState('');
//     const [questions, setQuestions] = useState({});
//     const [processingStatus, setProcessingStatus] = useState('');
//     const [progress, setProgress] = useState(0);
//     const [toasts, setToasts] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//       pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
//     }, []);

//     // Custom toast function
//     const showToast = (title, message, type = 'success') => {
//       const id = Date.now();
//       setToasts(prevToasts => [...prevToasts, { id, title, message, type }]);
      
//       // Auto dismiss after 3 seconds
//       setTimeout(() => {
//         setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
//       }, 3000);
//     };

//     const handleFileUpload = async (event) => {
//       const file = event.target.files[0];
//       if (!file) return;

//       if (file.type !== 'application/pdf') {
//         showToast('Invalid file type', 'Please upload a PDF file.', 'danger');
//         return;
//       }

//       setFileName(file.name);
//       setIsLoading(true);
//       setProgress(20);
//       setProcessingStatus('Extracting text from PDF...');

//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         try {
//           const typedarray = new Uint8Array(e.target.result);
//           const pdf = await pdfjs.getDocument(typedarray).promise;
//           let textContent = '';

//           setProgress(40);
//           setProcessingStatus('Analyzing content...');

//           for (let i = 1; i <= pdf.numPages; i++) {
//             const page = await pdf.getPage(i);
//             const content = await page.getTextContent();
//             const textItems = content.items.map(item => item.str).join(' ');
//             textContent += textItems + ' ';
//             setProgress(40 + Math.floor((i / pdf.numPages) * 30));
//           }

//           setProgress(70);
//           setProcessingStatus('Identifying keywords...');

//           const keywordsList = [
//             'Python', 'Java', 'JavaScript', 'C', 'C++', 'C#', 'Go', 'Ruby', 'Kotlin', 'Swift', 'R', 'PHP', 'TypeScript', 'Scala', 'Perl', 'Rust',
//             'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'SQL', 'MongoDB', 'Firebase',
//             'TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Linux', 'Git', 'Selenium', 'Algorithms', 'Data Structures', 'AI'
//           ];

//           const uniqueWords = new Set(textContent.toLowerCase().split(/[\s,.;:!?(){}\[\]<>"/\\]+/).filter(word => word));
//           const foundKeywords = keywordsList.filter(keyword => uniqueWords.has(keyword.toLowerCase()));
          
//           setKeywords(foundKeywords);
//           setProgress(100);
//           setProcessingStatus('Analysis complete!');

//           showToast('Resume processed successfully', `Found ${foundKeywords.length} relevant technologies.`);
//         } catch (error) {
//           console.error('Error processing PDF:', error);
//           showToast('Error processing file', 'There was an error analyzing your resume.', 'danger');
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       reader.readAsArrayBuffer(file);
//     };

//     const generateInterviewQuestions = async () => {
//       if (keywords.length === 0 && !selectedSubject) {
//         showToast('No skills selected', 'Please upload a resume or select a subject first.', 'warning');
//         return;
//       }

//       const targetKeywords = keywords.length > 0 ? keywords : [selectedSubject];
//       setIsLoading(true);
//       const newQuestions = {};
      
//       //const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       navigate('/interview');



//       for (let i = 0; i < targetKeywords.length; i++) {
//         const keyword = targetKeywords[i];
//         setProcessingStatus(`Generating questions for ${keyword}... (${i+1}/${targetKeywords.length})`);
//         setProgress(Math.floor(((i+1) / targetKeywords.length) * 100));
        
//         const prompt = `Generate 5 interview questions for the subject: ${keyword}`;
//         try {
//           const result = await model.generateContent(prompt);
//           newQuestions[keyword] = result.response.text();
//         } catch (error) {
//           console.error(`Error generating questions for ${keyword}:`, error);
//           newQuestions[keyword] = "Failed to generate questions.";
//         }
//       }

//       setQuestions(newQuestions);
//       setIsLoading(false);
//       setProgress(100);
//       setProcessingStatus('All questions generated successfully!');
      
//       showToast('Questions generated!', `Created interview questions for ${targetKeywords.length} technologies.`);
//     };

//     const removeKeyword = (keywordToRemove) => {
//       setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
//     };

//     return (
//       <div className="min-vh-100 bg-light">
//         <Navbar />
        
//         {/* Toast Container */}
//         <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
//           {toasts.map(toast => (
//             <div key={toast.id} className={`toast show bg-${toast.type} text-white`} role="alert" aria-live="assertive" aria-atomic="true">
//               <div className="toast-header">
//                 <strong className="me-auto">{toast.title}</strong>
//                 <button type="button" className="btn-close" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}></button>
//               </div>
//               <div className="toast-body">
//                 {toast.message}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="container py-4">
//           <div className="d-flex flex-column gap-4">
//             {/* Hero Section */}
//             <div className="p-4 rounded-3 text-white text-center" style={{ background: 'linear-gradient(to right, #4361ee, #7209b7)' }}>
//               <h1 className="display-5 fw-bold">Interview Preparation Assistant</h1>
//               <p className="fs-4 mx-auto" style={{ maxWidth: '800px' }}>
//                 Upload your resume to extract technical skills, or select a subject to generate tailored interview questions
//               </p>
//             </div>

//             {/* Main Action Area */}
//             <div className="row g-4">
//               {/* Left Side - Upload & Select */}
//               <div className="col-md-6">
//                 <div className="card h-100">
//                   <div className="card-body">
//                     <h5 className="card-title mb-4">Step 1: Select Your Skills</h5>
                    
//                     <div className="mb-4">
//                       <label className="form-label fw-medium">Upload Resume</label>
//                       <input 
//                         type="file"
//                         className="form-control d-none"
//                         accept="application/pdf"
//                         onChange={handleFileUpload}
//                         id="resume-upload"
//                       />
//                       <button 
//                         className="btn btn-outline-primary w-100 py-2"
//                         onClick={() => document.getElementById('resume-upload').click()}
//                       >
//                         <FaFileUpload className="me-2" />
//                         {fileName ? fileName : "Choose PDF File"}
//                       </button>
//                     </div>

//                     <div>
//                       <label className="form-label fw-medium">Or Select Subject</label>
//                       <select 
//                         className="form-select py-2"
//                         value={selectedSubject}
//                         onChange={(e) => setSelectedSubject(e.target.value)}
//                       >
//                         <option value="">Select a technology</option>
//                         <option value="Python">Python</option>
//                         <option value="Java">Java</option>
//                         <option value="JavaScript">JavaScript</option>
//                         <option value="React">React</option>
//                         <option value="Data Science">Data Science</option>
//                         <option value="Machine Learning">Machine Learning</option>
//                         <option value="SQL">SQL</option>
//                         <option value="AWS">AWS</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Side - Skills & Generate */}
//               <div className="col-md-6">
//                 <div className="card h-100">
//                   <div className="card-body d-flex flex-column">
//                     <h5 className="card-title mb-4">Step 2: Generate Questions</h5>

//                     {keywords.length > 0 && (
//                       <div className="mb-4">
//                         <label className="form-label fw-medium">Detected Skills:</label>
//                         <div className="d-flex flex-wrap gap-2">
//                           {keywords.map((keyword, index) => (
//                             <span key={index} className="badge bg-primary rounded-pill py-2 px-3">
//                               {keyword}
//                               <button 
//                                 className="btn btn-sm p-0 ms-2"
//                                 onClick={() => removeKeyword(keyword)} 
//                                 style={{ background: 'none', border: 'none', color: 'white' }}
//                               >
//                                 <FaTimes size={12} />
//                               </button>
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     <button
//                       className="btn btn-primary mt-auto py-2"
//                       style={{ backgroundColor: '#7209b7', borderColor: '#7209b7' }}
//                       onClick={generateInterviewQuestions}
//                       disabled={isLoading}
//                     >
//                       <FaPlay className="me-2" />
//                       {isLoading ? processingStatus : 'Generate Interview Questions'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Progress Section */}
//             {isLoading && (
//               <div className="card">
//                 <div className="card-body">
//                   <p className="fw-medium mb-2">{processingStatus}</p>
//                   <div className="progress" style={{ height: '15px' }}>
//                     <div 
//                       className="progress-bar progress-bar-striped progress-bar-animated" 
//                       role="progressbar" 
//                       style={{ width: `${progress}%`, backgroundColor: '#7209b7' }}
//                       aria-valuenow={progress} 
//                       aria-valuemin="0" 
//                       aria-valuemax="100"
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Results Section */}
//             {Object.keys(questions).length > 0 && (
//               <div className="card">
//                 <div className="card-body">
//                   <h4 className="mb-4">Your Interview Questions</h4>
//                   <div className="d-flex flex-column gap-4">
//                     {Object.entries(questions).map(([skill, questionList]) => (
//                       <div key={skill} className="card border">
//                         <div className="card-body">
//                           <h5 className="card-title text-primary mb-3">{skill}</h5>
//                           <pre className="card-text" style={{ whiteSpace: 'pre-line', fontFamily: 'inherit' }}>{questionList}</pre>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const Navbar = () => {
//     return (
//       <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm sticky-top">
//         <div className="container">
//           <a className="navbar-brand fw-bold text-primary" href="#" style={{ color: '#7209b7' }}>Interview Bot</a>
          
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//             <span className="navbar-toggler-icon"></span>
//           </button>
          
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav ms-auto">
//               <li className="nav-item">
//                 <a className="nav-link" href="#">
//                   <FaClipboard className="me-1" /> Dashboard
//                 </a>
//               </li>
//               <li className="nav-item">
//                 <a className="nav-link" href="interview">
//                   <FaUsers className="me-1" /> Community
//                 </a>
//               </li>
//               <li className="nav-item">
//                 <a className="nav-link" href="payment">
//                   <FaCreditCard className="me-1" /> Payment
//                 </a>
//               </li>
//               <li className="nav-item ms-3">
//                 <a className="nav-link" href="#">
//                   <FaUser size={18} />
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     );
//   };

//   export default HomePage;


import React, { useEffect, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFileUpload, FaPlay, FaUser, FaClipboard, FaUsers, FaCreditCard, FaTimes } from 'react-icons/fa';
import * as pdfjs from 'pdfjs-dist/webpack';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate } from 'react-router-dom';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [processingStatus, setProcessingStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  // Custom toast function
  const showToast = (title, message, type = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, title, message, type }]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Invalid file type', 'Please upload a PDF file.', 'danger');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setProgress(20);
    setProcessingStatus('Extracting text from PDF...');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target.result);
        const pdf = await pdfjs.getDocument(typedarray).promise;
        let textContent = '';

        setProgress(40);
        setProcessingStatus('Analyzing content...');

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const textItems = content.items.map(item => item.str).join(' ');
          textContent += textItems + ' ';
          setProgress(40 + Math.floor((i / pdf.numPages) * 30));
        }

        setProgress(70);
        setProcessingStatus('Identifying keywords...');

        const keywordsList = [
          'Python', 'Java', 'JavaScript', 'C', 'C++', 'C#', 'Go', 'Ruby', 'Kotlin', 'Swift', 'R', 'PHP', 'TypeScript', 'Scala', 'Perl', 'Rust',
          'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'SQL', 'MongoDB', 'Firebase',
          'TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Linux', 'Git', 'Selenium', 'Algorithms', 'Data Structures', 'AI'
        ];

        const uniqueWords = new Set(textContent.toLowerCase().split(/[\s,.;:!?(){}\[\]<>"/\\]+/).filter(word => word));
        const foundKeywords = keywordsList.filter(keyword => uniqueWords.has(keyword.toLowerCase()));
        
        setKeywords(foundKeywords);
        setProgress(100);
        setProcessingStatus('Analysis complete!');

        showToast('Resume processed successfully', `Found ${foundKeywords.length} relevant technologies.`);
      } catch (error) {
        console.error('Error processing PDF:', error);
        showToast('Error processing file', 'There was an error analyzing your resume.', 'danger');
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const generateInterviewQuestions = async () => {
    if (keywords.length === 0 && !selectedSubject) {
      showToast('No skills selected', 'Please upload a resume or select a subject first.', 'warning');
      return;
    }

    const targetKeywords = keywords.length > 0 ? keywords : [selectedSubject];
    setIsLoading(true);
    const newQuestions = {};
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    for (let i = 0; i < targetKeywords.length; i++) {
      const keyword = targetKeywords[i];
      setProcessingStatus(`Generating questions for ${keyword}... (${i+1}/${targetKeywords.length})`);
      setProgress(Math.floor(((i+1) / targetKeywords.length) * 100));
      
      try {
        // Update the prompt to generate structured questions with increasing difficulty
        const prompt = `Generate 5 interview questions for the subject: ${keyword}. 
        Structure them with increasing difficulty:
        1. Basic (1 question): Test fundamental knowledge
        2. Intermediate (3 questions): Test application of concepts
        3. Advanced (1 question): Test deep understanding
        
        Format as a numbered list: 1. [Question]`;
        
        const result = await model.generateContent(prompt);
        newQuestions[keyword] = result.response.text();
      } catch (error) {
        console.error(`Error generating questions for ${keyword}:`, error);
        newQuestions[keyword] = "Failed to generate questions.";
      }
    }

    setIsLoading(false);
    setProgress(100);
    setProcessingStatus('All questions generated successfully!');
    
    showToast('Questions generated!', `Created interview questions for ${targetKeywords.length} technologies.`);
    
    // Store questions in sessionStorage before navigating
    sessionStorage.setItem('interviewQuestions', JSON.stringify(newQuestions));
    navigate('/interview');
  };

  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
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
          {/* Hero Section */}
          <div className="p-4 rounded-3 text-white text-center" style={{ background: 'linear-gradient(to right, #4361ee, #7209b7)' }}>
            <h1 className="display-5 fw-bold">Interview Preparation Assistant</h1>
            <p className="fs-4 mx-auto" style={{ maxWidth: '800px' }}>
              Upload your resume to extract technical skills, or select a subject to generate tailored interview questions
            </p>
          </div>

          {/* Main Action Area */}
          <div className="row g-4">
            {/* Left Side - Upload & Select */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title mb-4">Step 1: Select Your Skills</h5>
                  
                  <div className="mb-4">
                    <label className="form-label fw-medium">Upload Resume</label>
                    <input 
                      type="file"
                      className="form-control d-none"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      id="resume-upload"
                    />
                    <button 
                      className="btn btn-outline-primary w-100 py-2"
                      onClick={() => document.getElementById('resume-upload').click()}
                    >
                      <FaFileUpload className="me-2" />
                      {fileName ? fileName : "Choose PDF File"}
                    </button>
                  </div>

                  <div>
                    <label className="form-label fw-medium">Or Select Subject</label>
                    <select 
                      className="form-select py-2"
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                      <option value="">Select a technology</option>
                      <option value="Python">Python</option>
                      <option value="Java">Java</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="React">React</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="SQL">SQL</option>
                      <option value="AWS">AWS</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Skills & Generate */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-4">Step 2: Generate Questions</h5>

                  {keywords.length > 0 && (
                    <div className="mb-4">
                      <label className="form-label fw-medium">Detected Skills:</label>
                      <div className="d-flex flex-wrap gap-2">
                        {keywords.map((keyword, index) => (
                          <span key={index} className="badge bg-primary rounded-pill py-2 px-3">
                            {keyword}
                            <button 
                              className="btn btn-sm p-0 ms-2"
                              onClick={() => removeKeyword(keyword)} 
                              style={{ background: 'none', border: 'none', color: 'white' }}
                            >
                              <FaTimes size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-primary mt-auto py-2"
                    style={{ backgroundColor: '#7209b7', borderColor: '#7209b7' }}
                    onClick={generateInterviewQuestions}
                    disabled={isLoading}
                  >
                    <FaPlay className="me-2" />
                    {isLoading ? processingStatus : 'Generate Interview Questions'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          {isLoading && (
            <div className="card">
              <div className="card-body">
                <p className="fw-medium mb-2">{processingStatus}</p>
                <div className="progress" style={{ height: '15px' }}>
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated" 
                    role="progressbar" 
                    style={{ width: `${progress}%`, backgroundColor: '#7209b7' }}
                    aria-valuenow={progress} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold text-primary" href="#" style={{ color: '#7209b7' }}>Interview Bot</a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <FaClipboard className="me-1" /> Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="interview">
                <FaUsers className="me-1" /> Community
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="payment">
                <FaCreditCard className="me-1" /> Payment
              </a>
            </li>
            <li className="nav-item ms-3">
              <a className="nav-link" href="#">
                <FaUser size={18} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HomePage;