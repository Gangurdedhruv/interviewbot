import { useState } from 'react';
import { FaUser, FaClipboard, FaUsers, FaCreditCard, FaLaptopCode, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm sticky-top">
            <div className="container">
                <a className="navbar-brand fw-bold text-primary" href="homepage" style={{ color: '#7209b7' }}>
                    <FaLaptopCode className="me-2 d-inline" /> PrepNexus
                </a>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                            <a className="nav-link" href="community">
                                <FaUsers className="me-1" /> Famous Interview Questions 
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="community">
                                <FaUsers className="me-1" /> Community
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="payment">
                                <FaCreditCard className="me-1" /> Payment
                            </a>
                        </li>
                        <li className="nav-item ms-3 dropdown">
                            <a 
                                className="nav-link dropdown-toggle" 
                                href="#" 
                                id="profileDropdown" 
                                role="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-expanded={dropdownOpen}
                            >
                                <FaUser size={18} className="me-1" /> Profile
                            </a>
                            <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`} aria-labelledby="profileDropdown">
                                <li>
                                    <a className="dropdown-item" href="/profile">
                                        <FaTachometerAlt className="me-2" /> Dashboard
                                    </a>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button 
                                        className="dropdown-item text-danger" 
                                        onClick={handleLogout}
                                    >
                                        <FaSignOutAlt className="me-2" /> Log Out
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;