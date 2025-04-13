import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHistory, FaArrowLeft, FaChartBar, FaLaptopCode, FaUserCircle } from 'react-icons/fa';
import RadarChart from '@/components/RadarChart';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('history'); // 'history' or 'stats'
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  // State to track which interview is selected
  const [interviewData, setInterviewData] = useState([])
  const [selectedInterviewId, setSelectedInterviewId] = useState("1");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setInterviewData([
        {
          "_id": "1",
          "userId": "660b2b31e9c4c81234abcd01",
          "skills": ["JavaScript", "React", "Data Structures"],
          "scores": [65, 35, 40],
          "keyConcepts": [
            ["closures", "hoisting", "event loop"],
            ["hooks", "useEffect", "component lifecycle"],
            ["binary trees", "linked lists", "time complexity"]
          ],
          "createdAt": "2025-04-01T10:12:00Z"
        },
        {
          "_id": "2",
          "userId": "660b2b31e9c4c81234abcd01",
          "skills": ["JavaScript", "React", "Data Structures"],
          "scores": [75, 60, 55],
          "keyConcepts": [
            ["async/await", "promises"],
            ["state management", "useMemo"],
            ["graphs", "recursion"]
          ],
          "createdAt": "2025-04-07T14:30:00Z"
        },
        {
          "_id": "3",
          "userId": "660b2b31e9c4c81234abcd01",
          "skills": ["JavaScript", "React", "Data Structures"],
          "scores": [85, 80, 70],
          "keyConcepts": [
            ["ES6 features", "arrow functions"],
            ["context API", "performance optimization"],
            ["dynamic programming", "hash maps"]
          ],
          "createdAt": "2025-04-12T09:45:00Z"
        }
      ])
      setUserProfile(JSON.parse(localStorage.getItem('user')));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      setInterviewData([]);
    }
    setLoading(false);
  };

  const getAverageScore = (scores) => {
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="container py-4 flex-grow-1">
        {/* Profile Header */}
        <div className="row mb-4">
          <div className="col-lg-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle text-white p-3 me-3">
                    <FaUserCircle size={50} />
                  </div>
                  <div>
                    <h3 className="mb-0">{userProfile?.name || 'User'}</h3>
                    <p className="text-muted mb-0">{userProfile?.email || 'Loading...'}</p>
                  </div>
                  <div className="ms-auto">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/edit-profile')}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Records Section */}
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="container py-4">
            <div className="d-flex justify-content-between mb-2">
              <h3 className="">Your Interview History</h3>
              <button 
                className="btn btn-outline-secondary ms-2" 
                onClick={fetchData}
              >
                Refresh
              </button>
            </div>

            <div className="row">
              {/* Interview List */}
              <div className="col-md-4">
                <div className="card shadow-sm">
                  <div className="card-header">
                    <h5 className="m-0">Interview Records</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {interviewData.map(interview => (
                        <button
                          key={interview._id}
                          className={`list-group-item list-group-item-action ${selectedInterviewId === interview._id ? 'active' : ''}`}
                          onClick={() => setSelectedInterviewId(interview._id)}
                        >
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">Interview #{interview._id}</h6>
                            <span className="badge bg-primary rounded-pill">
                              {getAverageScore(interview.scores)}%
                            </span>
                          </div>
                          <small>{new Date(interview.createdAt).toLocaleDateString()}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Radar Chart */}
              <div className="col-md-8">
                <RadarChart 
                  interviewData={interviewData} 
                  selectedInterviewId={selectedInterviewId} 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="ms-auto" style={{paddingRight:'120px'}} >
        <button 
          className="btn btn-outline-danger"
          onClick={() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login'); }}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;