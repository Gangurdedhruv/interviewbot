import React, { useRef, useEffect } from 'react';

const Compiler = ({ onCodeExecuted }) => {
  // Create a ref to access the iframe
  const iframeRef = useRef(null);
  
  useEffect(() => {
    // Set up message listener for communication with the iframe
    const handleMessage = (event) => {
      // Make sure the message is from OneCompiler
      if (event.origin.includes('onecompiler.com')) {
        // Check if it's a code execution result message
        if (event.data && event.data.type === 'codeExecutionComplete') {
          // Auto-send the results to the parent component
          onCodeExecuted({
            code: event.data.code,
            output: event.data.output,
            language: event.data.language
          });
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onCodeExecuted]);

  return (
    <div className="border-top">
      <div className="d-flex justify-content-between p-2 bg-dark text-white">
        <h6 className="m-0">Code Console</h6>
        <small>Write your code and click Run to automatically submit as your answer</small>
      </div>
      <iframe
        ref={iframeRef}
        height="450px"  
        src="https://onecompiler.com/embed?hideNew=true&hideNewFileOption=true&hideTitle=true&disableCopyPaste=true&disableAutoComplete=true&theme=dark&codeChangeEvent=true" 
        width="100%"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </div>
  );
};

export default Compiler;