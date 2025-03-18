import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHistory, FaArrowLeft, FaChartBar, FaLaptopCode, FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  // Initialize interviewResults as an empty array to prevent the .map() error
  const [interviewResults, setInterviewResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    skillCounts: [],
    recentActivity: [],
    keywordFrequency: []
  });
  const [viewMode, setViewMode] = useState('history'); // 'history' or 'stats'
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      };
      
      try {
        // Fetch user profile
        const profileResponse = await axios.get('/api/user/profile', config);
        setUserProfile(profileResponse.data);
      } catch (profileError) {
        console.error('Error fetching profile:', profileError);
        // Don't stop execution if profile fetch fails
      }
      
      try {
        // Fetch interview history
        const historyResponse = await axios.get('/api/interviews', config);
        // Ensure we're setting an array, even if the API returns something else
        setInterviewResults(Array.isArray(historyResponse.data) ? historyResponse.data : []);
      } catch (historyError) {
        console.error('Error fetching interview history:', historyError);
        setInterviewResults([]);
      }
      
      try {
        // Fetch interview statistics
        const statsResponse = await axios.get('/api/interviews/stats', config);
        setStats({
          skillCounts: Array.isArray(statsResponse.data.skillCounts) ? statsResponse.data.skillCounts : [],
          recentActivity: Array.isArray(statsResponse.data.recentActivity) ? statsResponse.data.recentActivity : [],
          keywordFrequency: Array.isArray(statsResponse.data.keywordFrequency) ? statsResponse.data.keywordFrequency : []
        });
      } catch (statsError) {
        console.error('Error fetching stats:', statsError);
        setStats({
          skillCounts: [],
          recentActivity: [],
          keywordFrequency: []
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load profile data. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 90) return 'bg-success';
    if (score >= 70) return 'bg-primary';
    if (score >= 50) return 'bg-warning text-dark';
    return 'bg-danger';
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand text-primary" to="/homepage">
            <FaLaptopCode className="me-2 d-inline" /> PrepNexus
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/homepage">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/practice">Practice</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/profile">Profile</Link>
              </li>
            </ul>
            <div className="ms-auto">
              <button 
                className="btn btn-outline-danger"
                onClick={() => {
                  localStorage.removeItem('userToken');
                  navigate('/login');
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <h4 className="m-0">
              {viewMode === 'history' ? (
                <><FaHistory className="me-2" />Interview Records</>
              ) : (
                <><FaChartBar className="me-2" />Performance Statistics</>
              )}
            </h4>
          </div>
          
          <div>
            <div className="btn-group">
              <button 
                className={`btn ${viewMode === 'history' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('history')}
                style={viewMode === 'history' ? {backgroundColor: '#7209b7', borderColor: '#7209b7'} : {}}
              >
                <FaHistory className="me-1" /> History
              </button>
              <button 
                className={`btn ${viewMode === 'stats' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('stats')}
                style={viewMode === 'stats' ? {backgroundColor: '#7209b7', borderColor: '#7209b7'} : {}}
              >
                <FaChartBar className="me-1" /> Statistics
              </button>
            </div>
            
            <button 
              className="btn btn-outline-secondary ms-2" 
              onClick={fetchData}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : viewMode === 'history' ? (
          <>
            {!interviewResults || interviewResults.length === 0 ? (
              <div className="alert alert-info">
                <p className="mb-2">You haven't completed any interviews yet.</p>
                <Link to="/practice" className="btn btn-primary">
                  Start Practicing
                </Link>
              </div>
            ) : (
              <div className="row">
                {Array.isArray(interviewResults) && interviewResults.map((result) => (
                  <div className="col-md-6 col-lg-4 mb-4" key={result._id || `interview-${Math.random()}`}>
                    <div className="card h-100 shadow-sm">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="m-0">{result.skillName || 'Interview'}</h5>
                        <span className={`badge ${getScoreBadgeColor(result.score || 0)}`}>
                          {result.score || 0}/100
                        </span>
                      </div>
                      <div className="card-body">
                        <p className="text-muted mb-3">
                          <small>Completed on {formatDate(result.completedAt)}</small>
                        </p>
                        
                        {result.keywords && Array.isArray(result.keywords) && result.keywords.length > 0 && (
                          <>
                            <h6>Areas to Review:</h6>
                            <div className="d-flex flex-wrap gap-1 mb-2">
                              {result.keywords.slice(0, 6).map((keyword, idx) => (
                                <span key={idx} className="badge bg-info text-dark rounded-pill">
                                  {keyword}
                                </span>
                              ))}
                              {result.keywords.length > 6 && (
                                <span className="badge bg-secondary rounded-pill">
                                  +{result.keywords.length - 6} more
                                </span>
                              )}
                            </div>
                          </>
                        )}
                        <div className="d-grid mt-3">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => navigate(`/interview/${result._id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="row">
            {/* Statistics View */}
            <>
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header">
                    <h5 className="m-0">Skills Breakdown</h5>
                  </div>
                  <div className="card-body">
                    {!stats.skillCounts || stats.skillCounts.length === 0 ? (
                      <p className="text-muted">No data available yet</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Skill</th>
                              <th>Interviews</th>
                              <th>Avg. Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(stats.skillCounts) && stats.skillCounts.map((skill) => (
                              <tr key={skill._id || `skill-${Math.random()}`}>
                                <td>{skill._id || 'Unknown'}</td>
                                <td>{skill.count || 0}</td>
                                <td>
                                  <span className={`badge ${getScoreBadgeColor(skill.avgScore || 0)}`}>
                                    {Math.round(skill.avgScore || 0)}/100
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header">
                    <h5 className="m-0">Recent Activity</h5>
                  </div>
                  <div className="card-body">
                    {!stats.recentActivity || stats.recentActivity.length === 0 ? (
                      <p className="text-muted">No recent activity</p>
                    ) : (
                      <div className="list-group">
                        {Array.isArray(stats.recentActivity) && stats.recentActivity.map((activity) => (
                          <div key={activity._id || `activity-${Math.random()}`} className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                              <h6 className="mb-1">{activity.skillName || 'Unknown'}</h6>
                              <span className={`badge ${getScoreBadgeColor(activity.score || 0)}`}>
                                {activity.score || 0}/100
                              </span>
                            </div>
                            <small className="text-muted">
                              {formatDate(activity.completedAt)}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header">
                    <h5 className="m-0">Performance Trend</h5>
                  </div>
                  <div className="card-body">
                    {!stats.recentActivity || !Array.isArray(stats.recentActivity) || stats.recentActivity.length < 2 ? (
                      <p className="text-muted">Complete more interviews to see performance trends</p>
                    ) : (
                      <div className="chart-container" style={{ height: '250px' }}>
                        {/* Placeholder for chart - in a real app, you'd render a chart here */}
                        <div className="alert alert-info">
                          Performance chart would be rendered here with recent scores
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-header">
                    <h5 className="m-0">Top Areas for Improvement</h5>
                  </div>
                  <div className="card-body">
                    {!stats.keywordFrequency || !Array.isArray(stats.keywordFrequency) || stats.keywordFrequency.length === 0 ? (
                      <p className="text-muted">Complete more interviews to see recommended areas for improvement</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Topic</th>
                              <th>Frequency</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.keywordFrequency.slice(0, 5).map((keyword, index) => (
                              <tr key={index}>
                                <td>{keyword.keyword || 'Unknown'}</td>
                                <td>{keyword.count || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-light py-4 mt-auto">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <span className="text-muted">© 2025 PrepNexus. All rights reserved.</span>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="#" className="text-decoration-none text-muted me-3">Privacy Policy</a>
              <a href="#" className="text-decoration-none text-muted">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;