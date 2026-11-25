

import { useState, useEffect, useRef } from "react";

import html2pdf from "html2pdf.js";

import "./App.css";



const emptyEducation = {

  school: "",

  degree: "",

  year: "",

  details: "",

};



const emptyProject = {

  name: "",

  technologies: "",

  description: "",

  link: "",

};



const emptyExperience = {

  company: "",

  role: "",

  duration: "",

  description: "",

};



const initialResume = {

  name: "",

  email: "",

  phone: "",

  location: "",

  linkedin: "",

  github: "",

  summary: "",

  skills: "",

  education: [{ ...emptyEducation }],

  projects: [{ ...emptyProject }],

  experience: [{ ...emptyExperience }],

};



// ==================== MAIN APP ====================



function App() {

  const [page, setPage] = useState("home");

  const [template, setTemplate] = useState("modern");

  const [resume, setResume] = useState(initialResume);

  const [saved, setSaved] = useState(false);

  const resumePreviewRef = useRef(null);



  useEffect(() => {

    const savedResume = localStorage.getItem("our-resume-data");

    const savedTemplate = localStorage.getItem("our-resume-template");



    if (savedResume) {

      try {

        const parsed = JSON.parse(savedResume);



        setResume({

          ...initialResume,

          ...parsed,

          education: Array.isArray(parsed.education)

            ? parsed.education

            : [{ ...emptyEducation }],

          projects: Array.isArray(parsed.projects)

            ? parsed.projects

            : [{ ...emptyProject }],

          experience: Array.isArray(parsed.experience)

            ? parsed.experience

            : [{ ...emptyExperience }],

        });

      } catch {

        console.log("Unable to load saved resume.");

      }

    }



    if (savedTemplate) {

      setTemplate(savedTemplate);

    }

  }, []);



  useEffect(() => {

    if (page !== "builder") return;



    localStorage.setItem("our-resume-data", JSON.stringify(resume));

    localStorage.setItem("our-resume-template", template);



    setSaved(true);

    const timer = setTimeout(() => setSaved(false), 1500);



    return () => clearTimeout(timer);

  }, [resume, template, page]);



  const updateField = (field, value) => {

    setResume((prev) => ({

      ...prev,

      [field]: value,

    }));

  };



  const updateArrayItem = (section, index, field, value) => {

    setResume((prev) => {

      const updatedArray = [...prev[section]];



      updatedArray[index] = {

        ...updatedArray[index],

        [field]: value,

      };



      return {

        ...prev,

        [section]: updatedArray,

      };

    });

  };



  const addItem = (section, emptyItem) => {

    setResume((prev) => ({

      ...prev,

      [section]: [...prev[section], { ...emptyItem }],

    }));

  };



  const removeItem = (section, index) => {

    setResume((prev) => ({

      ...prev,

      [section]: prev[section].filter((_, i) => i !== index),

    }));

  };



  const downloadPDF = () => {

    const element = resumePreviewRef.current;



    if (!element) return;



    const options = {

      margin: 0,

      filename: `${resume.name.trim() || "My"}-Resume.pdf`,

      image: {

        type: "jpeg",

        quality: 0.98,

      },

      html2canvas: {

        scale: 2,

        useCORS: true,

        backgroundColor: "#ffffff",

      },

      jsPDF: {

        unit: "mm",

        format: "a4",

        orientation: "portrait",

      },

      pagebreak: {

        mode: ["css", "legacy"],

      },

    };



    html2pdf().set(options).from(element).save();

  };



  const clearResume = () => {

    if (window.confirm("Are you sure you want to clear your resume?")) {

      setResume({

        ...initialResume,

        education: [{ ...emptyEducation }],

        projects: [{ ...emptyProject }],

        experience: [{ ...emptyExperience }],

      });



      localStorage.removeItem("our-resume-data");

    }

  };



  return (

    <div className="app">

      {page === "home" ? (

        <HomePage onStart={() => setPage("builder")} />

      ) : (

        <BuilderPage

          resume={resume}

          template={template}

          setTemplate={setTemplate}

          updateField={updateField}

          updateArrayItem={updateArrayItem}

          addItem={addItem}

          removeItem={removeItem}

          goHome={() => setPage("home")}

          downloadPDF={downloadPDF}

          clearResume={clearResume}

          saved={saved}

          resumePreviewRef={resumePreviewRef}

        />

      )}

    </div>

  );

}



// ==================== HOME PAGE ====================



function HomePage({ onStart }) {

  return (

    <div className="home-page">

      <nav className="home-navbar">

        <div className="brand">

          <span className="brand-icon">R</span>

          <span>OurResume</span>

        </div>



        <button className="nav-button" onClick={onStart}>

          Build Resume <span>↗</span>

        </button>

      </nav>



      <main className="hero">

        <div className="hero-badge">

          <span className="badge-dot"></span>

          FREE RESUME BUILDER

        </div>



        <h1>

          Your career starts

          <br />

          with a <span>great resume.</span>

        </h1>



        <p className="hero-description">

          Create a professional resume in minutes. Simple tools,

          beautiful templates, and a resume that helps you stand out.

        </p>



        <button className="hero-button" onClick={onStart}>

          Create My Resume <span>→</span>

        </button>



        <div className="hero-features">

          <div>✓ Free to use</div>

          <div>✓ Easy to customize</div>

          <div>✓ PDF download</div>

          <div>✓ ATS score checker</div>

        </div>



        <div className="hero-preview">

          <div className="preview-window-bar">

            <span></span>

            <span></span>

            <span></span>

            <p>Resume Preview</p>

          </div>



          <div className="mini-resume">

            <div className="mini-resume-header">

              <div className="mini-name">YOUR NAME</div>

              <div className="mini-contact">

                email\@example.com · +91 98765 43210

              </div>

            </div>



            <div className="mini-section">

              <h4>PROFILE</h4>

              <div className="mini-line long"></div>

              <div className="mini-line"></div>

            </div>



            <div className="mini-section">

              <h4>EDUCATION</h4>

              <div className="mini-line long"></div>

              <div className="mini-line short"></div>

            </div>



            <div className="mini-section">

              <h4>PROJECTS</h4>

              <div className="mini-line long"></div>

              <div className="mini-line"></div>

              <div className="mini-line short"></div>

            </div>

          </div>

        </div>

      </main>



      <section className="home-bottom">

        <h2>Everything you need. Nothing you don't.</h2>

        <p>

          Designed to help students and freshers start their careers.

        </p>



        <div className="home-feature-grid">

          <div className="home-feature">

            <span>✦</span>

            <h3>Simple Builder</h3>

            <p>Fill in your details and see your resume update instantly.</p>

          </div>



          <div className="home-feature">

            <span>▤</span>

            <h3>Beautiful Templates</h3>

            <p>Choose a layout that matches your career.</p>

          </div>



          <div className="home-feature">

            <span>↓</span>

            <h3>PDF Download</h3>

            <p>Export your resume for job applications.</p>

          </div>



          <div className="home-feature">

            <span>◎</span>

            <h3>ATS Score</h3>

            <p>Check important resume sections and improve them.</p>

          </div>

        </div>

      </section>



      <footer className="home-footer">

        Made for your next opportunity.

      </footer>

    </div>

  );

}



// ==================== BUILDER PAGE ====================



function BuilderPage({

  resume,

  template,

  setTemplate,

  updateField,

  updateArrayItem,

  addItem,

  removeItem,

  goHome,

  downloadPDF,

  clearResume,

  saved,

  resumePreviewRef,

}) {

  return (

    <div className="builder-page">

      <header className="builder-navbar">

        <button className="brand brand-button" onClick={goHome}>

          <span className="brand-icon">R</span>

          <span>OurResume</span>

        </button>



        <div className="builder-nav-right">

          <span className="save-status">

            {saved ? "✓ Saved" : "● Auto-save"}

          </span>



          <button className="outline-button" onClick={goHome}>

            Home

          </button>



          <button className="download-button" onClick={downloadPDF}>

            ↓ Download PDF

          </button>

        </div>

      </header>



      <div className="builder-heading">

        <h1>Resume Builder</h1>

        <p>Create and customize your professional resume.</p>

      </div>



      <div className="builder-layout">

        <div className="editor-column">



          {/* PERSONAL INFORMATION */}



          <section className="editor-card">

            <SectionHeading

              number="01"

              title="Personal Information"

              subtitle="Your contact details"

            />



            <div className="form-grid">

              <InputField

                label="Full Name"

                placeholder="John Doe"

                value={resume.name}

                onChange={(v) => updateField("name", v)}

              />



              <InputField

                label="Email"

                placeholder="john\@email.com"

                value={resume.email}

                onChange={(v) => updateField("email", v)}

              />



              <InputField

                label="Phone"

                placeholder="+91 98765 43210"

                value={resume.phone}

                onChange={(v) => updateField("phone", v)}

              />



              <InputField

                label="Location"

                placeholder="Chennai, India"

                value={resume.location}

                onChange={(v) => updateField("location", v)}

              />



              <InputField

                label="LinkedIn"

                placeholder="linkedin.com/in/username"

                value={resume.linkedin}

                onChange={(v) => updateField("linkedin", v)}

              />



              <InputField

                label="GitHub"

                placeholder="github.com/username"

                value={resume.github}

                onChange={(v) => updateField("github", v)}

              />

            </div>

          </section>



          {/* SUMMARY */}



          <section className="editor-card">

            <SectionHeading

              number="02"

              title="Professional Summary"

              subtitle="Introduce yourself professionally"

            />



            <textarea

              className="form-textarea"

              rows={5}

              placeholder="Write a short summary about your skills, career goals and strengths..."

              value={resume.summary}

              onChange={(e) => updateField("summary", e.target.value)}

            />

          </section>



          {/* EDUCATION */}



          <section className="editor-card">

            <SectionHeading

              number="03"

              title="Education"

              subtitle="Your academic background"

            />



            {resume.education.map((edu, index) => (

              <div className="repeatable-item" key={index}>

                <RepeatHeader

                  title={`Education ${index + 1}`}

                  onRemove={() => removeItem("education", index)}

                  showRemove={resume.education.length > 1}

                />



                <div className="form-grid">

                  <InputField

                    label="School / College"

                    placeholder="College name"

                    value={edu.school}

                    onChange={(v) =>

                      updateArrayItem("education", index, "school", v)

                    }

                  />



                  <InputField

                    label="Degree"

                    placeholder="B.E Computer Science"

                    value={edu.degree}

                    onChange={(v) =>

                      updateArrayItem("education", index, "degree", v)

                    }

                  />



                  <InputField

                    label="Year"

                    placeholder="2022 - 2026"

                    value={edu.year}

                    onChange={(v) =>

                      updateArrayItem("education", index, "year", v)

                    }

                  />



                  <InputField

                    label="CGPA / Details"

                    placeholder="CGPA: 8.5 / 10"

                    value={edu.details}

                    onChange={(v) =>

                      updateArrayItem("education", index, "details", v)

                    }

                  />

                </div>

              </div>

            ))}



            <button

              className="add-button"

              onClick={() => addItem("education", emptyEducation)}

            >

              + Add Education

            </button>

          </section>



          {/* EXPERIENCE */}



          <section className="editor-card">

            <SectionHeading

              number="04"

              title="Experience / Internship"

              subtitle="Work, internship or volunteering experience"

            />



            {resume.experience.map((exp, index) => (

              <div className="repeatable-item" key={index}>

                <RepeatHeader

                  title={`Experience ${index + 1}`}

                  onRemove={() => removeItem("experience", index)}

                  showRemove={resume.experience.length > 1}

                />



                <div className="form-grid">

                  <InputField

                    label="Company"

                    placeholder="Company name"

                    value={exp.company}

                    onChange={(v) =>

                      updateArrayItem("experience", index, "company", v)

                    }

                  />



                  <InputField

                    label="Role"

                    placeholder="Web Development Intern"

                    value={exp.role}

                    onChange={(v) =>

                      updateArrayItem("experience", index, "role", v)

                    }

                  />



                  <InputField

                    label="Duration"

                    placeholder="Jun 2025 - Aug 2025"

                    value={exp.duration}

                    onChange={(v) =>

                      updateArrayItem("experience", index, "duration", v)

                    }

                  />

                </div>



                <label className="field-label">Description</label>

                <textarea

                  className="form-textarea"

                  rows={3}

                  placeholder="Describe your responsibilities and achievements..."

                  value={exp.description}

                  onChange={(e) =>

                    updateArrayItem(

                      "experience",

                      index,

                      "description",

                      e.target.value

                    )

                  }

                />

              </div>

            ))}



            <button

              className="add-button"

              onClick={() => addItem("experience", emptyExperience)}

            >

              + Add Experience

            </button>

          </section>



          {/* PROJECTS */}



          <section className="editor-card">

            <SectionHeading

              number="05"

              title="Projects"

              subtitle="Showcase your work"

            />



            {resume.projects.map((project, index) => (

              <div className="repeatable-item" key={index}>

                <RepeatHeader

                  title={`Project ${index + 1}`}

                  onRemove={() => removeItem("projects", index)}

                  showRemove={resume.projects.length > 1}

                />



                <InputField

                  label="Project Name"

                  placeholder="Resume Builder"

                  value={project.name}

                  onChange={(v) =>

                    updateArrayItem("projects", index, "name", v)

                  }

                />



                <InputField

                  label="Technologies"

                  placeholder="React, JavaScript, CSS"

                  value={project.technologies}

                  onChange={(v) =>

                    updateArrayItem("projects", index, "technologies", v)

                  }

                />



                <label className="field-label">Project Description</label>

                <textarea

                  className="form-textarea"

                  rows={3}

                  placeholder="Describe your project..."

                  value={project.description}

                  onChange={(e) =>

                    updateArrayItem(

                      "projects",

                      index,

                      "description",

                      e.target.value

                    )

                  }

                />



                <InputField

                  label="Project Link"

                  placeholder="https://github.com/..."

                  value={project.link}

                  onChange={(v) =>

                    updateArrayItem("projects", index, "link", v)

                  }

                />

              </div>

            ))}



            <button

              className="add-button"

              onClick={() => addItem("projects", emptyProject)}

            >

              + Add Project

            </button>

          </section>



          {/* SKILLS */}



          <section className="editor-card">

            <SectionHeading

              number="06"

              title="Skills"

              subtitle="Separate each skill with a comma"

            />



            <textarea

              className="form-textarea"

              rows={3}

              placeholder="React, JavaScript, HTML, CSS, Python, Communication..."

              value={resume.skills}

              onChange={(e) => updateField("skills", e.target.value)}

            />

          </section>



          {/* ATS CHECKER */}



          <ATSChecker resume={resume} />
          <JobDescriptionAnalyzer resume={resume} />



          <button className="clear-button" onClick={clearResume}>

            Clear All Resume Data

          </button>

        </div>



        {/* LIVE PREVIEW */}



        <div className="preview-column">

          <div className="preview-toolbar">

            <div>

              <h2>Live Preview</h2>

              <p>Your resume updates automatically</p>

            </div>



            <button className="download-button" onClick={downloadPDF}>

              ↓ PDF

            </button>

          </div>



          <div className="template-picker">

            <p>CHOOSE TEMPLATE</p>



            <div className="template-options">

              <TemplateOption

                name="Classic"

                active={template === "classic"}

                onClick={() => setTemplate("classic")}

              />



              <TemplateOption

                name="Modern"

                active={template === "modern"}

                onClick={() => setTemplate("modern")}

              />



              <TemplateOption

                name="Minimal"

                active={template === "minimal"}

                onClick={() => setTemplate("minimal")}

              />

            </div>

          </div>



          <div className="resume-preview-wrapper">

            <ResumePreview

              resume={resume}

              template={template}

              resumePreviewRef={resumePreviewRef}

            />

          </div>



          <button

            className="preview-download-full"

            onClick={downloadPDF}

          >

            Download Resume as PDF ↓

          </button>

        </div>

      </div>

    </div>

  );

}



// ==================== REUSABLE FORM COMPONENTS ====================



function SectionHeading({ number, title, subtitle }) {

  return (

    <div className="card-heading">

      <span className="section-number">{number}</span>

      <div>

        <h2>{title}</h2>

        <p>{subtitle}</p>

      </div>

    </div>

  );

}



function RepeatHeader({ title, onRemove, showRemove }) {

  return (

    <div className="repeatable-header">

      <h3>{title}</h3>



      {showRemove && (

        <button className="remove-button" onClick={onRemove}>

          Remove

        </button>

      )}

    </div>

  );

}



function InputField({ label, placeholder, value, onChange }) {

  return (

    <div className="form-field">

      <label className="field-label">{label}</label>



      <input

        type="text"

        className="form-input"

        placeholder={placeholder}

        value={value || ""}

        onChange={(e) => onChange(e.target.value)}

      />

    </div>

  );

}



// ==================== TEMPLATE PICKER ====================



function TemplateOption({ name, active, onClick }) {

  return (

    <button

      className={`template-option ${active ? "active" : ""}`}

      onClick={onClick}

    >

      <div className={`template-thumbnail ${name.toLowerCase()}`}>

        <div className="thumb-header"></div>

        <div className="thumb-line"></div>

        <div className="thumb-line small"></div>

        <div className="thumb-section"></div>

        <div className="thumb-line"></div>

        <div className="thumb-line small"></div>

      </div>



      <span>{name}</span>

      {active && <span className="template-check">✓</span>}

    </button>

  );

}



// ==================== RESUME PREVIEW ====================



function ResumePreview({ resume, template, resumePreviewRef }) {

  const skills = resume.skills

    .split(",")

    .map((skill) => skill.trim())

    .filter(Boolean);



  const hasEducation = resume.education.some(

    (e) => e.school || e.degree || e.year || e.details

  );



  const hasExperience = resume.experience.some(

    (e) => e.company || e.role || e.duration || e.description

  );



  const hasProjects = resume.projects.some(

    (p) => p.name || p.technologies || p.description || p.link

  );



  const contactItems = [

    resume.email,

    resume.phone,

    resume.location,

    resume.linkedin,

    resume.github,

  ].filter(Boolean);



  return (

    <div

      ref={resumePreviewRef}

      className={`resume-sheet resume-${template}`}

    >

      <div className="resume-header">

        <h1>{resume.name || "Your Name"}</h1>



        {resume.summary && (

          <p className="resume-summary-header">{resume.summary}</p>

        )}



        {contactItems.length > 0 && (

          <div className="resume-contact">

            {contactItems.map((item, index) => (

              <span key={index}>{item}</span>

            ))}

          </div>

        )}

      </div>



      {resume.summary && (

        <ResumeSection title="PROFILE">

          <p className="resume-paragraph">{resume.summary}</p>

        </ResumeSection>

      )}



      {hasEducation && (

        <ResumeSection title="EDUCATION">

          {resume.education.map((edu, index) => {

            if (!edu.school && !edu.degree && !edu.year && !edu.details) {

              return null;

            }



            return (

              <div className="resume-entry" key={index}>

                <div className="resume-entry-top">

                  <strong>{edu.school}</strong>

                  <span>{edu.year}</span>

                </div>



                {edu.degree && <p>{edu.degree}</p>}

                {edu.details && <p>{edu.details}</p>}

              </div>

            );

          })}

        </ResumeSection>

      )}



      {hasExperience && (

        <ResumeSection title="EXPERIENCE">

          {resume.experience.map((exp, index) => {

            if (

              !exp.company &&

              !exp.role &&

              !exp.duration &&

              !exp.description

            ) {

              return null;

            }



            return (

              <div className="resume-entry" key={index}>

                <div className="resume-entry-top">

                  <strong>{exp.role || exp.company}</strong>

                  <span>{exp.duration}</span>

                </div>



                {exp.role && exp.company && <p>{exp.company}</p>}



                {exp.description && (

                  <p className="resume-paragraph">{exp.description}</p>

                )}

              </div>

            );

          })}

        </ResumeSection>

      )}



      {hasProjects && (

        <ResumeSection title="PROJECTS">

          {resume.projects.map((project, index) => {

            if (

              !project.name &&

              !project.technologies &&

              !project.description &&

              !project.link

            ) {

              return null;

            }



            return (

              <div className="resume-entry" key={index}>

                <strong>{project.name}</strong>



                {project.technologies && (

                  <p className="resume-technologies">

                    {project.technologies}

                  </p>

                )}



                {project.description && (

                  <p className="resume-paragraph">{project.description}</p>

                )}



                {project.link && <p className="resume-link">{project.link}</p>}

              </div>

            );

          })}

        </ResumeSection>

      )}



      {skills.length > 0 && (

        <ResumeSection title="SKILLS">

          <div className="resume-skills">

            {skills.map((skill, index) => (

              <span key={index}>{skill}</span>

            ))}

          </div>

        </ResumeSection>

      )}

    </div>

  );

}



function ResumeSection({ title, children }) {

  return (

    <section className="resume-section">

      <h2>{title}</h2>

      {children}

    </section>

  );

}



// ==================== ATS SCORE CHECKER ====================



function JobDescriptionAnalyzer({ resume }) {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const analyzeJobDescription = () => {
    if (!jobDescription.trim()) {
      window.alert("Please paste a job description first.");
      return;
    }

    const stopWords = new Set([
      "the", "and", "for", "with", "you", "your", "our", "are", "this",
      "that", "from", "will", "have", "has", "been", "being", "who", "what",
      "when", "where", "why", "how", "their", "they", "them", "its", "into",
      "about", "over", "under", "such", "all", "any", "can", "may", "must",
      "should", "a", "an", "of", "to", "in", "on", "at", "by", "as", "is",
      "be", "or", "we", "us", "it", "if", "not", "more", "than", "etc",
      "job", "role", "work", "team", "experience", "years", "skills", "ability",
      "knowledge", "strong", "good", "preferred", "required", "including"
    ]);

    const extractKeywords = (text) => {
      const words = text.toLowerCase().match(/[a-z][a-z+#.]{1,}/g) || [];
      return [...new Set(words.filter((word) => word.length > 2 && !stopWords.has(word)))];
    };

    const resumeText = [
      resume.name,
      resume.summary,
      resume.skills,
      ...(resume.education || []).flatMap((item) => [item.school, item.degree, item.details]),
      ...(resume.projects || []).flatMap((item) => [item.name, item.technologies, item.description]),
      ...(resume.experience || []).flatMap((item) => [item.company, item.role, item.duration, item.description]),
    ].join(" ").toLowerCase();

    const keywords = extractKeywords(jobDescription);
    const matched = keywords.filter((word) => resumeText.includes(word));
    const missing = keywords.filter((word) => !resumeText.includes(word));

    setAnalysis({
      matched,
      missing,
      score: keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0,
      total: keywords.length,
    });
  };

  return (
    <section className="jd-card">
      <div className="jd-heading">
        <div>
          <span className="section-eyebrow">JOB MATCH</span>
          <h2>Job Description Analyzer</h2>
          <p>Compare your resume with a job description and find missing keywords.</p>
        </div>
        <span className="jd-icon">⌕</span>
      </div>

      <label className="jd-label" htmlFor="job-description">Paste job description</label>
      <textarea
        id="job-description"
        className="jd-textarea"
        value={jobDescription}
        onChange={(event) => setJobDescription(event.target.value)}
        placeholder="Paste the job description here..."
        rows={7}
      />
      <button className="jd-analyze-button" type="button" onClick={analyzeJobDescription}>
        Analyze Job Match
      </button>

      {analysis && (
        <div className="jd-results" aria-live="polite">
          <div className="jd-score-row">
            <div>
              <span className="jd-score-label">Keyword match</span>
              <strong className="jd-score">{analysis.score}%</strong>
            </div>
            <p>{analysis.matched.length} of {analysis.total} keywords found</p>
          </div>
          <div className="jd-keyword-section">
            <h3>Matching keywords ({analysis.matched.length})</h3>
            {analysis.matched.length ? (
              <div className="jd-keywords">
                {analysis.matched.map((word) => <span className="jd-match" key={word}>{word}</span>)}
              </div>
            ) : <p className="jd-empty">No matching keywords found yet.</p>}
          </div>
          <div className="jd-keyword-section">
            <h3>Missing keywords ({analysis.missing.length})</h3>
            {analysis.missing.length ? (
              <div className="jd-keywords">
                {analysis.missing.map((word) => <span className="jd-missing" key={word}>{word}</span>)}
              </div>
            ) : <p className="jd-empty">Great! No keywords are missing from this comparison.</p>}
          </div>
          <p className="jd-tip">Tip: Add relevant missing skills or experience only when they genuinely reflect your background.</p>
        </div>
      )}
      <p className="jd-disclaimer">This is a basic keyword comparison, not an AI assessment or a guarantee of passing an ATS.</p>
    </section>
  );
}

function ATSChecker({ resume }) {

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.email.trim());



  const skillsList = resume.skills

    .split(",")

    .map((s) => s.trim())

    .filter(Boolean);



  const checks = [

    {

      label: "Full name added",

      done: resume.name.trim().length > 0,

      points: 5,

    },

    {

      label: "Valid email address",

      done: validEmail,

      points: 5,

    },

    {

      label: "Phone number added",

      done: resume.phone.trim().length >= 8,

      points: 5,

    },

    {

      label: "Professional summary (50+ characters)",

      done: resume.summary.trim().length >= 50,

      points: 15,

    },

    {

      label: "Education details",

      done: resume.education.some(

        (e) => e.school.trim() && e.degree.trim()

      ),

      points: 10,

    },

    {

      label: "At least 5 skills added",

      done: skillsList.length >= 5,

      points: 15,

    },

    {

      label: "Project with description",

      done: resume.projects.some(

        (p) => p.name.trim() && p.description.trim()

      ),

      points: 15,

    },

    {

      label: "Experience or internship details",

      done: resume.experience.some(

        (e) =>

          e.company.trim() &&

          e.role.trim() &&

          e.description.trim()

      ),

      points: 10,

    },

    {

      label: "Achievement numbers / metrics",

      done: /(\d+%|\d+\+|\d+\s\*(users|projects|hours|clients))/i.test(

        [

          resume.summary,

          ...resume.projects.map((p) => p.description),

          ...resume.experience.map((e) => e.description),

        ].join(" ")

      ),

      points: 10,

    },

    {

      label: "LinkedIn or GitHub profile",

      done: Boolean(resume.linkedin.trim() || resume.github.trim()),

      points: 5,

    },

    {

      label: "Location added",

      done: resume.location.trim().length > 0,

      points: 5,

    },

  ];



  const score = checks.reduce(

    (total, item) => total + (item.done ? item.points : 0),

    0

  );



  const completed = checks.filter((item) => item.done).length;



  const suggestions = checks.filter((item) => !item.done);



  let scoreLabel = "Needs improvement";

  let scoreClass = "low";



  if (score >= 80) {

    scoreLabel = "Excellent resume";

    scoreClass = "high";

  } else if (score >= 60) {

    scoreLabel = "Good progress";

    scoreClass = "medium";

  }



  return (

    <section className="ats-card">

      <div className="ats-heading">

        <div>

          <span className="ats-eyebrow">RESUME ANALYSIS</span>

          <h2>ATS Resume Score</h2>

          <p>Improve your resume with these checks.</p>

        </div>



        <span className={`ats-status ${scoreClass}`}>

          {scoreLabel}

        </span>

      </div>



      <div className="ats-score-area">

        <div

          className="ats-score-circle"

          style={{ "--score": score }}

        >

          <div className="ats-score-inner">

            <strong>{score}</strong>

            <span>/100</span>

          </div>

        </div>



        <div className="ats-score-info">

          <h3>{score}% Score</h3>

          <p>

            {completed} of {checks.length} checks completed

          </p>



          <div className="ats-progress-track">

            <div

              className={`ats-progress-fill ${scoreClass}`}

              style={{ width: `${score}%` }}

            ></div>

          </div>

        </div>

      </div>



      <div className="ats-checklist">

        <h3>Resume Checklist</h3>



        {checks.map((item, index) => (

          <div className="ats-check-item" key={index}>

            <span className={item.done ? "check-done" : "check-pending"}>

              {item.done ? "✓" : "○"}

            </span>



            <span className={`check-label ${item.done ? "done" : ""}`}>

              {item.label}

            </span>



            <span className="check-points">

              {item.done ? `+${item.points}` : `${item.points} pts`}

            </span>

          </div>

        ))}

      </div>



      {suggestions.length > 0 ? (

        <div className="ats-suggestions">

          <h3>💡 Suggestions to improve</h3>



          <ul>

            {suggestions.slice(0, 5).map((item, index) => (

              <li key={index}>{item.label}</li>

            ))}

          </ul>

        </div>

      ) : (

        <div className="ats-success">

          🎉 Great! You've completed all resume checks.

        </div>

      )}



      <p className="ats-disclaimer">

        This is a checklist-based estimate, not a real ATS scan or a

        guarantee of getting shortlisted. Tailor your resume to each job

        description.

      </p>

    </section>

  );

}



export default App;
