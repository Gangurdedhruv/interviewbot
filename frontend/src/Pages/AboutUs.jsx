import React from 'react';

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Dhruv",
      role: "Full Stack Developer",
      image: "../images/dhruv.jpg",
      bio: `Hi, I'm Dhruv — a tech enthusiast, lifelong learner, and the brain behind PrepNexus. My journey began with a passion for coding and a curiosity for how things work under the hood. From exploring card magic to writing scripts, I've always believed in mastering both the art and logic behind anything I do.\n\nAs someone who's been through the rollercoaster of technical interviews, I realized how overwhelming and unstructured preparation can feel. That's what inspired me to create PrepNexus — not just as a tool, but as a community-powered platform where interview prep is smart, structured, and actually enjoyable. This project reflects my core values: attention to detail, creative problem solving, and building with purpose. Every feature — from resume-based question generation to mock interviews — is designed to simplify the process for students, freshers, and job-seekers like you.\n\nLet's crack interviews together, one question at a time. 🚀`
    },
    {
      id: 2,
      name: "Dhanesh Narayanan",
      role: "Full Stack Developer",
      image: "../images/dhanesh.jpg",
      bio: `Hi, I'm Dhanesh— a passionate developer and someone who lives and breathes computer science. From algorithms to full-stack development, I enjoy diving deep into the core of technology and building solutions that are clean, scalable, and efficient.\n\nAs a co-creator of PrepNexus, I bring a strong technical foundation and an eye for architecture and system design. I’ve always believed that a good developer doesn’t just write code — they craft experiences, think logically, and solve real-world problems with precision. This project reflects that philosophy — combining structured learning with intuitive design.\n\nWhether it's building responsive interfaces, optimizing backend logic, or brainstorming new features, I'm committed to making PrepNexus a powerful tool for anyone navigating the tech interview journey.`
    }
  ];

  const formatBio = (bioText) => {
    return bioText.split('\n\n').map((paragraph, index) => (
      <p key={index} className="card-text">{paragraph.trim()}</p>
    ));
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="container py-5 flex-grow-1">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold" style={{ color: '#7209b7' }}>About Us</h1>
          <p className="lead text-muted">
            Meet the team behind PrepNexus - helping you ace your technical interviews
          </p>
          <hr className="my-4" />
        </div>

        {/* Team Section */}
        <div className="mb-5">
          <h2 className="text-center mb-4">Our Team</h2>

          {teamMembers.map((member, index) => (
            <div key={member.id} className={`row align-items-center mb-5 ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
              {/* Image Column */}
              <div className="col-lg-4 mb-4 mb-lg-0 text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="rounded-circle img-thumbnail shadow-lg"
                  style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                />
              </div>

              {/* Info Column */}
              <div className="col-lg-8">
                <div className="card shadow-lg border-0 h-100">
                  <div className="card-body">

                    <h3 className="card-title fw-bold" style={{ color: '#7209b7' }}>{member.name}</h3>
                    <h5 className="card-subtitle mb-3 text-muted">{member.role}</h5>
                    <div className="mb-3">
                      {formatBio(member.bio)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
