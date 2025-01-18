import React, { useEffect, useState } from 'react';
import { Box, Heading, Input, Button } from '@chakra-ui/react';
import * as pdfjs from 'pdfjs-dist/webpack';
import '../../CSS/Header.css';

const HomePage = () => {

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, [])

  const [keywords, setKeywords] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target.result);
  
        const pdf = await pdfjs.getDocument(typedarray).promise;
        let textContent = '';
  
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const textItems = content.items.map(item => item.str).join(' ');
          textContent += textItems + ' ';
        }
  
        const keywords = ['Python', 'Java', 'React', 'Node.js', 'Data Science'];
        const foundKeywords = keywords.filter(keyword =>
          textContent.toLowerCase().includes(keyword.toLowerCase())
        );
  
        alert(`Found Keywords: ${foundKeywords.join(', ')}`);
      };
  
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };
  
  const extractTechnicalKeywords = (text) => {
    const technicalTerms = ['Python', 'Java', 'React', 'Node.js', 'SQL', 'Data Science'];
    const foundKeywords = technicalTerms.filter(term => text.includes(term));
    setKeywords(foundKeywords);
  };

  return (
    <Box>
      <Header onFileUpload={handleFileUpload} />
      <Box className="hero-section">
        <Heading>Extracted Keywords: {keywords.join(', ')}</Heading>
      </Box>
    </Box>
  );
};

const Header = ({ onFileUpload }) => {
  return (
    <>
      <header className="header">
        <nav className="dashboard">
          <a href="#dashboard">Dashboard</a>
        </nav>
        <div className="title">Interview Bot</div>
        <nav className="community">
          <a href="#community">Community</a>
        </nav>
        <div className="profile-icon"></div>
      </header>

      <div className="main-container">
        <div className="button-container">
          <Input type="file" accept="application/pdf" onChange={onFileUpload} hidden id="resume-upload" />
          <Button className="upload-btn" onClick={() => document.getElementById('resume-upload').click()}>
            Upload Resume
          </Button>
          <select className="subject-select" value="">
            <option value="" disabled>Select Subject</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="datascience">Data Science</option>
          </select>
          <button className="start-btn">Start</button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
