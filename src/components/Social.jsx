import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../components/social.css'; 

const Social = () => {
  return (
    <div>
      <nav className="social">
        <ul>
          <li><a href="https://x.com/Retrunvold" target="_blank" rel="noopener noreferrer">Twitter <i className="fa-brands fa-square-x-twitter"></i></a></li>
          <li><a href="https://github.com/retrunv0id" target="_blank" rel="noopener noreferrer">Github <i className="fa-brands fa-github"></i></a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Social;
