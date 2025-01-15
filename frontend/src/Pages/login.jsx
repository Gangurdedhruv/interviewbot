import { useState } from "react";
import { Box, Input, Button, VStack, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();  
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      alert(result.message);
      if (result.success){
        navigate('/homepage'); 
      
      }
    } catch (error) {   
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Heading>Login</Heading>
      <VStack spacing={4}>
        <Input name="email" placeholder="Email" type="email" onChange={handleChange} />
        <Input name="password" placeholder="Password" type="password" onChange={handleChange} />
        <Button onClick={handleLogin}>Login</Button>
      </VStack>
    </Box>
  );
};

export default Login;
