import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaThumbsUp, FaComment, FaBookmark, FaTags, FaFilter, FaSort } from 'react-icons/fa';
import NavBar from '@/components/Navbar'

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [toasts, setToasts] = useState([]);

    // Simulated popular tags
    const popularTags = [
        { name: 'React', count: 124 },
        { name: 'JavaScript', count: 98 },
        { name: 'Python', count: 87 },
        { name: 'Java', count: 65 },
        { name: 'SQL', count: 54 },
        { name: 'AWS', count: 43 },
        { name: 'Machine Learning', count: 38 },
    ];

    // Example/mock data for community posts
    const mockPosts = [
        {
        id: 1,
        title: 'What are the most important React hooks to know for interviews?',
        content: 'I have an upcoming interview for a React developer position. Which hooks should I prioritize studying and how would you explain them in simple terms?',
        author: 'reactLearner',
        date: '2 days ago',
        votes: 24,
        answers: 8,
        views: 156,
        tags: ['React', 'JavaScript', 'Interviews']
        },
        {
        id: 2,
        title: 'How to prepare for AWS Solution Architect interview?',
        content: 'I\'m interviewing for an AWS Solution Architect role next month. What services should I focus on and what kind of scenario questions should I expect?',
        author: 'cloudEnthusiast',
        date: '5 days ago',
        votes: 18,
        answers: 5,
        views: 127,
        tags: ['AWS', 'Cloud', 'Interviews']
        },
        {
        id: 3,
        title: 'Python coding challenges that commonly come up in interviews',
        content: 'Can anyone share the most frequent Python coding challenges they\'ve encountered during technical interviews? I\'m specifically looking for data structure problems.',
        author: 'pythonista',
        date: '1 week ago',
        votes: 32,
        answers: 12,
        views: 243,
        tags: ['Python', 'Algorithms', 'Data Structures']
        },
        {
        id: 4,
        title: 'How to explain SQL joins in an interview?',
        content: 'I struggle explaining the different types of joins (inner, left, right, full) in a clear way. Any tips on how to articulate this during interviews?',
        author: 'dataWizard',
        date: '2 weeks ago',
        votes: 15,
        answers: 7,
        views: 198,
        tags: ['SQL', 'Database', 'Interviews']
        },
        {
        id: 5,
        title: 'Best resources to prepare for machine learning interviews',
        content: 'I\'m looking for books, courses, or practice platforms that focus specifically on machine learning interview questions. Any recommendations?',
        author: 'mlEngineer',
        date: '3 weeks ago',
        votes: 29,
        answers: 11,
        views: 267,
        tags: ['Machine Learning', 'Data Science', 'AI']
        }
    ];

    // Custom toast function (same as homepage)
    const showToast = (title, message, type = 'success') => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, title, message, type }]);
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
        }, 3000);
    };

    useEffect(() => {
        // Simulate API call to fetch posts
        const loadPosts = async () => {
        setIsLoading(true);
        try {
            // In a real application, this would be an API call
            setTimeout(() => {
            setPosts(mockPosts);
            setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error loading posts:', error);
            showToast('Error loading posts', 'Failed to load community posts', 'danger');
            setIsLoading(false);
        }
        };

        loadPosts();
    }, []);

    // Filter posts based on search and tags
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    // Sort posts based on selected sort option
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortBy === 'newest') {
        return b.id - a.id; // Simple proxy for date in this example
        } else if (sortBy === 'votes') {
        return b.votes - a.votes;
        } else if (sortBy === 'answers') {
        return b.answers - a.answers;
        }
        return 0;
    });

    const handleNewQuestion = () => {
        showToast('Feature coming soon', 'The ability to post new questions will be available soon!');
    };

    return (
        <div className="min-vh-100 bg-light">
        <NavBar />
        
        {/* Toast Container */}
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {toasts.map(toast => (
            <div key={toast.id} className={`toast show bg-${toast.type} text-white`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
                <strong className="me-auto">{toast.title}</strong>
                <button type="button" className="btn-close" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}></button>
            </div>
            <div className="toast-body">
                {toast.message}
            </div>
            </div>
        ))}
        </div>

        <div className="container py-4">
        <div className="d-flex flex-column gap-4">
            {/* Hero Section */}
            <div className="p-4 rounded-3 text-white text-center" style={{ background: 'linear-gradient(to right, #4361ee, #7209b7)' }}>
            <h1 className="display-5 fw-bold">Interview Community</h1>
            <p className="fs-4 mx-auto" style={{ maxWidth: '800px' }}>
                Ask questions, share tips, and learn from other job seekers preparing for technical interviews
            </p>
            </div>

            {/* Main Content Area */}
            <div className="row g-4">
            {/* Left Side - Filters and Tags */}
            <div className="col-md-3">
                <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">Popular Tags</h5>
                    <div className="d-flex flex-column gap-2">
                    {popularTags.map((tag, index) => (
                        <button 
                        key={index} 
                        className={`btn btn-sm text-start d-flex justify-content-between align-items-center ${selectedTag === tag.name ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedTag(selectedTag === tag.name ? '' : tag.name)}
                        >
                        <span>{tag.name}</span>
                        <span className="badge bg-secondary rounded-pill">{tag.count}</span>
                        </button>
                    ))}
                    </div>
                </div>
                </div>
                
                <div className="card">
                <div className="card-body">
                    <h5 className="card-title mb-3">Filter By</h5>
                    <div className="d-flex flex-column gap-2">
                    <button className="btn btn-outline-secondary btn-sm text-start">
                        <FaFilter className="me-2" /> Unanswered Questions
                    </button>
                    <button className="btn btn-outline-secondary btn-sm text-start">
                        <FaFilter className="me-2" /> My Bookmarks
                    </button>
                    <button className="btn btn-outline-secondary btn-sm text-start">
                        <FaFilter className="me-2" /> My Questions
                    </button>
                    </div>
                </div>
                </div>
            </div>

            {/* Right Side - Post Listings */}
            <div className="col-md-9">
                <div className="card mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
                    <div className="input-group">
                        <span className="input-group-text" id="search-addon">
                        <FaSearch />
                        </span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search questions..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <select 
                            className="form-select" 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ width: 'auto', height: 'auto' }}
                        >
                            <option value="newest">Newest</option>
                            <option value="votes">Most Votes</option>
                            <option value="answers">Most Answers</option>
                        </select>
                        <button 
                            className="btn btn-primary" 
                            style={{ backgroundColor: '#7209b7', borderColor: '#7209b7'}}
                            onClick={handleNewQuestion}
                        >
                            Ask Question
                        </button>
                    </div>
                    </div>
                </div>
                </div>

                {/* Posts List */}
                {isLoading ? (
                <div className="card">
                    <div className="card-body text-center p-5">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem', color: '#7209b7' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading community posts...</p>
                    </div>
                </div>
                ) : (
                <div className="d-flex flex-column gap-3">
                    {sortedPosts.length > 0 ? (
                    sortedPosts.map(post => (
                        <div key={post.id} className="card">
                        <div className="card-body">
                            <div className="d-flex" >
                            {/* Stats Column */}
                            <div className="d-none d-md-flex flex-column align-items-center me-3 text-center" style={{ minWidth: '65px' }}>
                                <div className="p-2">
                                    <div className="fw-bold">{post.votes}</div>
                                    <div className="small text-secondary">votes</div>
                                </div>
                                <div className="p-2">
                                    <div className="fw-bold">{post.answers}</div>
                                    <div className="small text-secondary">answers</div>
                                </div>
                                    <div className="p-2">
                                    <div className="small text-secondary">{post.views} views</div>
                                </div>
                            </div>
                            
                            {/* Content Column */}
                            <div className="flex-grow-1" style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <a href="#" className="h5 card-title text-decoration-none" style={{ color: '#4361ee' }}>
                                    {post.title}
                                </a>
                                <p className="card-text text-truncate mb-2" style={{ maxWidth: '100%'}}>
                                    {post.content}
                                </p>
                                <div className="d-flex justify-content-left align-items-center">
                                    {post.tags.map((tag, idx) => (
                                    <span key={idx} className="badge bg-light text-dark me-1 py-1 px-2">
                                        {tag}
                                    </span>
                                    ))}
                                </div>
                                <div className="d-flex justify-content-end align-items-end">
                                    <div className="small text-secondary">
                                        <span className="me-2">asked {post.date}</span>
                                        <span className="fw-medium">{post.author}</span>
                                    </div>
                                </div>

                                {/* Mobile stats bar (visible on small screens) */}
                                <div className="d-flex d-md-none justify-content-between mt-3 pt-2 border-top">
                                    <div className="d-flex align-items-center">
                                        <FaThumbsUp className="text-secondary me-1" />
                                        <span className="small text-secondary">{post.votes}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <FaComment className="text-secondary me-1" />
                                        <span className="small text-secondary">{post.answers}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <FaBookmark className="text-secondary me-1" />
                                        <span className="small text-secondary">Save</span>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    ))
                    ) : (
                    <div className="card">
                        <div className="card-body text-center p-4">
                            <FaTags className="text-secondary mb-3" style={{ fontSize: '2rem' }} />
                            <h5>No questions found</h5>
                            <p className="text-secondary">Try adjusting your search or filters</p>
                        </div>
                    </div>
                    )}
                    
                    {/* Pagination */}
                    {sortedPosts.length > 0 && (
                    <nav aria-label="Page navigation" className="mt-2">
                        <ul className="pagination justify-content-center">
                            <li className="page-item disabled">
                                <a className="page-link" href="#" tabIndex="-1">Previous</a>
                            </li>
                            <li className="page-item active">
                                <a className="page-link" href="#" style={{ backgroundColor: '#7209b7', borderColor: '#7209b7' }}>1</a>
                            </li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item">
                                <a className="page-link" href="#">Next</a>
                            </li>
                        </ul>
                    </nav>
                    )}
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    </div>
    )
}

export default Community;