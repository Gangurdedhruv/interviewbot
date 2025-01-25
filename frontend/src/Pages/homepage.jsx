import React, { useEffect, useState } from 'react';
import { Box, Heading, Input, Button } from '@chakra-ui/react';
import * as pdfjs from 'pdfjs-dist/webpack';
import '../../CSS/Header.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("");

const HomePage = () => {
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

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

        const keywordsList = [
          'Python', 'Java', 'JavaScript', 'C', 'C++', 'C#', 'Go', 'Ruby', 'Kotlin', 'Swift', 'R', 'PHP', 'TypeScript', 'Scala', 'Perl', 'Rust',
          'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'SQL', 'MongoDB', 'Firebase',
          'TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Linux', 'Git', 'Selenium', 'Algorithms', 'Data Structures'
        ];

        const words = textContent
          .toLowerCase()
          .split(/[\s,.;:!?(){}\[\]<>"/\\]+/)
          .filter(word => word);

        const uniqueWords = new Set(words);
        const foundKeywords = keywordsList.filter(keyword => uniqueWords.has(keyword.toLowerCase()));
        setKeywords(foundKeywords);
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const generateInterviewQuestions = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    for (const keyword of keywords) {
      const prompt = `Generate 5 interview questions for the subject: ${keyword}`;
      try {
        const result = await model.generateContent(prompt);
        console.log(`\n📚 Interview Questions for ${keyword}:\n`);
        console.log(result.response.text());
      } catch (error) {
        console.error(`❌ Error generating questions for ${keyword}:`, error);
      }
    }
  };

  return (
    <Box>
      <Header onFileUpload={handleFileUpload} onStart={generateInterviewQuestions} />
      <Box className="hero-section">
        <Heading>Extracted Keywords: {keywords.join(', ')}</Heading>
      </Box>
    </Box>
  );
};

const Header = ({ onFileUpload, onStart }) => {
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
          <Button className="start-btn" onClick={onStart}>Start</Button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
