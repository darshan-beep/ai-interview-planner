import React, { useState ,useEffect} from 'react';
import '../styles/interview.scss';
import { useinterview } from '../hooks/useinterview';
import { useParams } from 'react-router-dom';
import { getinterviewreportById } from '../services/interview.api';



const QuestionCard = ({ question, index, isOpen, onToggle }) => (
    <article className={`question-card ${isOpen ? 'is-expanded' : ''}`}>
        <button className="question-header" type="button" onClick={onToggle}>
            <span className="question-number">
                {String(index + 1).padStart(2, '0')}
            </span>

            <h3>{question.question}</h3>

            <span className="question-chevron">{isOpen ? '⌃' : '⌄'}</span>
        </button>

        {isOpen && (
            <div className="question-content">
                <div className="question-block">
                    <span className="content-label intention-label">Intention</span>
                    <p>{question.intention}</p>
                </div>

                <div className="question-block">
                    <span className="content-label answer-label">Model Answer</span>
                    <p>{question.answer}</p>
                </div>
            </div>
        )}
    </article>
);

const Interview = () => {
    const {report,getreportbyid,loading,getPdf} = useinterview();
    const [activeSection, setActiveSection] = useState('technical');
    const [openQuestion, setOpenQuestion] = useState(null);
    const{ interviewId }= useParams()
    useEffect(()=>{
        if(interviewId){
            getreportbyid(interviewId)
   }

    },[interviewId])
    if(loading||!report){
       return( <main>
            <h1>loading...</h1>
        </main>)
    }

    const questions =
        activeSection === 'technical'
            ? report.technicalQuestions
            : report.behavioralQuestions;

    const showSection = (section) => {
        setActiveSection(section);
        setOpenQuestion(null);
    };

    return (
        <main className="interview-results">
            <section className="results-shell">
                <aside className="results-sidebar">
                    <div className="sidebar-label">
                         <span className="sections-label">SECTIONS</span>

                    <nav className="results-navigation">
                        <button
                            className={activeSection === 'technical' ? 'active' : ''}
                            type="button"
                            onClick={() => showSection('technical')}
                        >
                            <span>⌘</span>
                            Technical Questions
                        </button>

                        <button
                            className={activeSection === 'behavioral' ? 'active' : ''}
                            type="button"
                            onClick={() => showSection('behavioral')}
                        >
                            <span>▱</span>
                            Behavioral Questions
                        </button>

                        <button
                            className={activeSection === 'roadmap' ? 'active' : ''}
                            type="button"
                            onClick={() => showSection('roadmap')}
                        >
                            <span>➤</span>
                            Road Map
                        </button>
                    </nav>
                     </div>
                    <button className='choco' onClick={()=>{getPdf(interviewId)}}> Get Resume</button>
                   
                </aside>

                <section className="questions-panel">
                    {activeSection === 'roadmap' ? (
                        <>
                            <header className="panel-header">
                                <h1>Preparation Road Map</h1>
                                <span>{report.preparationPlan.length} days</span>
                            </header>

                            <div className="roadmap-list">
                                {report.preparationPlan.map((item) => (
                                    <article className="roadmap-card" key={item.day}>
                                        <div className="roadmap-day">Day {item.day}</div>
                                        <div>
                                            <h2>{item.focus}</h2>
                                            <ul>
                                                {item.tasks.map((task) => (
                                                    <li key={task}>{task}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <header className="panel-header">
                                <h1>
                                    {activeSection === 'technical'
                                        ? 'Technical Questions'
                                        : 'Behavioral Questions'}
                                </h1>
                                <span>{questions.length} questions</span>
                            </header>

                            <div className="question-list">
                                {questions.map((question, index) => (
                                    <QuestionCard
                                        key={question.question}
                                        question={question}
                                        index={index}
                                        isOpen={openQuestion === index}
                                        onToggle={() =>
                                            setOpenQuestion(
                                                openQuestion === index ? null : index,
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>

                <aside className="results-summary">
                    <section className="score-section">
                        <span className="summary-label">Match Score</span>

                        <div className="score-ring">
                            <strong>{report.matchScore}</strong>
                            <small>%</small>
                        </div>

                        <p>Strong match for this role</p>
                    </section>

                    <section className="skills-section">
                        <span className="summary-label">Skill Gaps</span>

                        <div className="skill-list">
                            {report.skillGaps.map((gap) => (
                                <span className={`skill-tag ${gap.severity}`} key={gap.skill}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </section>
                </aside>
            </section>
        </main>
    );
};

export default Interview;