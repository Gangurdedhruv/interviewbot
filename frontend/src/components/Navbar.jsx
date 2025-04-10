import { FaUser, FaClipboard, FaUsers, FaCreditCard, FaLaptopCode } from 'react-icons/fa';

const NavBar = () => {
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
                        {/* <li className="nav-item">
                            <a className="nav-link" href="#">
                                <FaClipboard className="me-1" /> Dashboard
                            </a>
                        </li> */}
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
                        <li className="nav-item ms-3">
                            <a className="nav-link" href="profile">
                                <FaUser size={18} /> Profile 
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;