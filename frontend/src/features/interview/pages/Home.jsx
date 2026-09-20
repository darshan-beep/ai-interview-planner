import React from 'react';
import '../styles/home.scss';
import { useinterview } from '../hooks/useinterview';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const{loading,generatereport,reports} = useinterview();
    const[jobdescription,setjobdescription] = useState("");
    const[selfdescription,setselfdescription] = useState("");
    const resumeInputRef = useRef();
    const handleGenerateReport = async () => {
        const resumefile = resumeInputRef.current.files[0];
       const data = await generatereport({resumefile,selfdescription,jobdescription});
        navigate(`/interview/${data._id}`)
    }
    if(loading){
        return(
        <main>
            <h1>loading report...</h1>
        </main>
        )
    }
    return (
        <main className="interview-page">
            <section className="interview-card">
                <header className="page-header">
                    <h1>
                        Create Your Custom{' '}
                        <span>Interview Plan</span>
                    </h1>
                    <p>
                        Let our AI analyze the job requirements and your unique profile
                        to build a winning strategy.
                    </p>
                </header>

                <div className="content-grid">
                    <section className="form-section">
                        <div className="section-title">
                            <h2>▰ Target Job Description</h2>
                            <span>Required</span>
                        </div>

                        <textarea
                            className="job-description"
                            placeholder={
                                'Paste the full job description here...\n\n' +
                                'e.g. “Senior Frontend Engineer at Google requires\n' +
                                'proficiency in React, TypeScript, and large-scale system\n' +
                                'design...”'
                            }
                            value={jobdescription}
                            onChange={(e)=>setjobdescription(e.target.value)}
                        />

                        <small className="character-count">
                            0 / 5000 chars
                        </small>
                    </section>

                    <section className="form-section profile-section">
                        <div className="section-title">
                            <h2>♟your Profile</h2>
                        </div>

                        <label className="input-label">
                            Upload Resume <span>(Optional)</span>
                        </label>

                        <label className="upload-area">
                            <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" />
                            <strong>♧</strong>
                            <b>Click to upload or drag &amp; drop</b>
                            <small>PDF or DOCX files only</small>
                        </label>

                        <div className="or-divider">
                            <span>OR</span>
                        </div>

                        <label className="input-label" htmlFor="description">
                            Quick Self-Description
                        </label>

                        <textarea
                        value={selfdescription}
                        onChange={(e)=>setselfdescription(e.target.value)}
                            id="description"
                            className="profile-description"
                            placeholder="Briefly describe your experience, key skills, and years of experience in your field..."
                        />

                        <div className="info-box">
                            <span>●</span>
                            <p>
                                Either a Resume or a Self Description is required to
                                generate a personalized plan.
                            </p>
                        </div>
                    </section>
                </div>

                <footer className="card-footer">
                    <span className="security-note">
                        ✦ AI-Powered Strategy Generation • Approx. 30s
                    </span>

                    <button
                    onClick={handleGenerateReport}
                     className="generate-button" type="button">
                        ✣ Generate My Interview Strategy
                    </button>
                   

                </footer>
                
              <nav className="footer-links" aria-label="Footer navigation">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms and Conditions</a>
                <a href="#help">Help Centre</a>
            </nav>
   
  
            </section>
            {/* Recent Reports List */}
{reports.length > 0 && (
  <section className='recent-reports'>
    <h2>My Recent Interview Plans</h2>
    <ul className='reports-list'>
      {reports.map(report => (
        <li 
          key={report._id} 
          className='report-item' 
          onClick={() => navigate(`/interview/${report._id}`)}
        >
          <h3>{report.title || 'Untitled Position'}</h3>
          <h4>MatchScore:{report.matchScore}</h4>
          <p className='report-meta'>
            Generated on {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  </section>
)}

            
        </main>
    );
};

export default Home;