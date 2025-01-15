import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./Pages/registration";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Homepage from "./Pages/Homepage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
  );
}

export default App;
