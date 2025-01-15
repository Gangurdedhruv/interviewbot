import { useState } from "react";
import { Box, Input, Button, VStack, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      alert(result.message);
      if (result.success) {
        navigate("/homepage"); 
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Heading>Register</Heading>
      <VStack spacing={4}>
        <Input name="name" placeholder="Username" onChange={handleChange} />
        <Input name="email" placeholder="Email" type="email" onChange={handleChange} />
        <Input name="password" placeholder="Password" type="password" onChange={handleChange} />
        <Button onClick={handleRegister}>Register</Button>
         <Link to="/login">Already have an account? Login here</Link>.
      </VStack>
    </Box>
  );
};

export default Registration;
