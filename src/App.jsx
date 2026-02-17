import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';
import assignBondsCode from './code-snippets/assign_bonds.py?raw';

// ====================================================================
// HERO COMPONENT
// ====================================================================
const Hero = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="start"
      className="relative h-screen snap-start flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      {/* Background blur */}
      <div
        className="absolute inset-0 bg-center bg-cover blur-xl scale-110 opacity-60"
        style={{
          backgroundImage: `url('/your-portrait.jpg')`,
          filter: scrolled ? "blur(30px) brightness(1.2)" : "blur(20px)",
        }}
      />

      {/* Portrait */}
      <div className="relative z-10 w-[1920px] max-w-full h-full flex items-center justify-center">
        <img
          src="/hero.jpg"
          className="h-full object-contain transition-all duration-700"
          style={{ filter: scrolled ? "blur(10px) brightness(1.1)" : "none" }}
        />
        
        {/* Text overlay */}
        <div className="absolute text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4" style={{ textShadow: "2px 2px 20px rgba(0,0,0,0.6)" }}>
            Victor Varming
          </h1>
          <p className="text-2xl md:text-3xl text-white" style={{ textShadow: "1px 1px 15px rgba(0,0,0,0.6)" }}>
            Computational Chemist with a Background in Pharmaceutical Sciences
          </p>
        </div>
      </div>
    </section>
  );
};

// ====================================================================
// NAVIGATION COMPONENT
// ====================================================================
const Navigation = ({ activeSection, sections }) => {
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col justify-between" style={{ height: '80vh' }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="text-right transition-all duration-300 text-base"
            style={{
              color: activeSection === section.id ? section.color : '#6b7280',
              fontWeight: activeSection === section.id ? '600' : '400',
              transform: activeSection === section.id ? 'translateX(-4px)' : 'translateX(0)',
              whiteSpace: 'pre-line',
            }}
          >
            {section.title}
          </button>
        ))}
      </div>
    </nav>
  );
};


const PdfViewer = ({ file }) => {
  const iframeRef = useRef(null);
  const [height, setHeight] = useState(0);
  const A4_RATIO = 1.414;

  useEffect(() => {
    const updateHeight = () => {
      const containerWidth = iframeRef.current?.offsetWidth || 0;
      setHeight(containerWidth * A4_RATIO);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div ref={iframeRef} className="w-full overflow-hidden">
      <iframe
        ref={iframeRef}
        src={`${file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        className="w-full border-0"
        style={{ height }}
      />
    </div>
  );
};

// ====================================================================
// RESUME COMPONENT (PDF)
// ====================================================================
const Resume = () => {
  return (
    <section
      id="resume"
      className="w-full min-h-screen py-20 bg-gradient-to-b from-blue-50 to-white snap-start"
    >
      <div className="w-3/4 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-blue-900 text-center">
          Resumé
        </h2>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-6">
            <PdfViewer file="/resume.pdf" />
          </div>
        </div>
      </div>
    </section>
  );
};



// ====================================================================
// SCIENCE COMMUNICATION COMPONENT
// ====================================================================


const ScienceCommunication = () => {
  const videos = [
    { src: "/videos/1.mp4", title: "Ligand Binding Pocket: Co-Folded without α-subunit" },
    {
      src: "/videos/2.mp4",
      title: (
        <>
          Protein Morph: Co-folded without → with α-subunit.<br />
          The α-subunit forces correct bending of receptor chain α-helix
        </>
      ),
      cropLeft: true, // flag to apply left crop
    },       
    { src: "/videos/3.mp4", title: "Ligand pocket morph: Co-folded without → with α-subunit" },
    { src: "/videos/4.mp4", title: "Ligand binding pocket: Co-folded with α-subunit" },
  ];

  return (
    <section
      id="science-comm"
      className="w-full min-h-screen py-20 bg-gradient-to-b from-green-50 to-white"
    >
      <div className="w-3/4 max-w-6xl mx-auto space-y-24">

        {/* SECTION TITLE */}
        <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-12 text-center">
          Scientific Communication
        </h2>

        {/* PROTEIN VISUALISATIONS */}
        <div className="space-y-12">

          {/* Sticky section header */}
          <div className="sticky top-0 z-30 bg-green-100 px-6 py-4 rounded shadow-md border-b">
            <h3 className="text-3xl font-semibold text-green-900 mb-2">
              A Case Study in GPCR Co-folding: The Effect of the α-Subunit
            </h3>
            <p className="text-gray-700">
              A prostacyclin receptor co-folded with a ligand by AlphaFold 3, both with and without its G-protein α-subunit.<br />
              The α-subunit in this case significantly alters the predicted conformation of the receptor chain and thereby the ligand binding pocket.
            </p>
          </div>

          {/* Videos */}
          {videos.map((video, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Video */}
              <video
                src={video.src}
                autoPlay
                loop
                muted
                className={`w-full rounded-lg ${video.cropLeft ? "object-cover object-[-100px_0]" : ""}`}
              />

              {/* Title overlay (top center) */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-900 bg-opacity-70 text-white px-4 py-2 rounded text-lg font-semibold text-center z-20">
                {video.title}
              </div>

              {/* Legend overlay (left, vertically centered) */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-green-100 bg-opacity-80 text-green-900 p-4 rounded shadow-md z-20">
                <p>Ground Truth Protein: Grey</p>
                <p>Ground Truth Ligand: White</p>
                <p>AlphaFold 3 Folded Protein: Blue</p>
                <p>AlphaFold 3 Folded Ligand: Light Blue</p>
              </div>
            </div>
          ))}

        </div>

        {/* RESEARCH POSTER */}
        <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
          {/* Sticky header */}
          <div className="sticky top-0 z-20 bg-green-100 px-6 py-4 border-b rounded shadow-md">
            <h3 className="text-2xl font-semibold text-green-900">
              Research Poster: DeepDockingDare
            </h3>
            <p className="text-gray-700 mt-1">
              Poster presented at Center for Pharmaceutical Data Education Symposium
            </p>
          </div>

          {/* Poster content */}
          <div className="px-6 py-6">
            <PdfViewer file="/posters/poster1.pdf" />
          </div>
        </div>

      </div>
    </section>
  );
};




// ====================================================================
// CODE SNIPPETS COMPONENT
// ====================================================================
const CodeSnippets = ({ snippets }) => {
  const [expanded, setExpanded] = useState({});
  const PREVIEW_LINES = 40;

  const toggleExpand = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section id="code-snippets" className="w-full min-h-screen py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="w-3/4 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-purple-900">Code Snippets</h2>
        <div className="space-y-6">
          {snippets.map((snippet) => {
            const codeLines = snippet.code.split('\n');
            const isExpanded = expanded[snippet.key];
            const codeToShow = isExpanded ? snippet.code : codeLines.slice(0, PREVIEW_LINES).join('\n');

            return (
              <div key={snippet.key} className="bg-white rounded-lg shadow-md overflow-hidden border border-purple-200 relative">
                <div className="bg-purple-100 px-6 py-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900">{snippet.title}</h3>
                    <p className="text-gray-700">{snippet.description}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">
                      {snippet.language}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleExpand(snippet.key)}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>

                <div className="relative">
                  {!isExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                  <SyntaxHighlighter
                    language={snippet.language}
                    style={oneLight}
                    showLineNumbers
                    wrapLines
                    customStyle={{ margin: 0, padding: '1.5rem', maxHeight: isExpanded ? 'none' : '400px', overflow: 'hidden' }}
                  >
                    {codeToShow}
                  </SyntaxHighlighter>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const snippets = [
  {
    key: 'assignBonds',
    title: 'Unification of Two Small Molecules Instances Based on SMILES',
    description: (
      <>
        Strips molecules of bondtype and charges → Applies atom numbering and bond types based on SMILES.<br />
        This ensures uniform kekulization and other properties designed to enable RDKit processing.<br />
        Based on the RDKit function: AssignBondOrdersFromTemplate.
      </>
    ),
    language: 'python',
    code: assignBondsCode,
  },
];


// ====================================================================
// PUBLICATIONS COMPONENT
// ====================================================================
const Publications = () => {
  const publications = [
    { title: 'DeepDockingDare Preprint Coming Soon', authors: 'We are actively progression towards a preprint. See poster above for a sneak peak.', journal: '', year: '', doi: '', link: '' },
  ];

  return (
    <section id="publications" className="w-full min-h-screen py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="w-3/4 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-orange-900">Publications</h2>
        <div className="space-y-6">
          {publications.map((pub, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-orange-900">{pub.title}</h3>
              <p className="text-gray-700 mb-2">{pub.authors}</p>
              <p className="text-gray-600 italic mb-2">{pub.journal}, {pub.year}</p>
              <a href={pub.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800">
                <ExternalLink size={16} /> DOI: {pub.doi}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ====================================================================
// AWARDS COMPONENT
// ====================================================================
const Awards = () => {
  const awards = [
    { 
      title: 'H.C. Ørsted Medal', 
      organization: 'School of Pharmaceutical Sciences, University of Copenhagen', 
      year: '2025', 
      description: (
        <>
          Awarded for achieving a grade average above 10.5 in both the BSc and MSc, and a top grade of 12 on the final thesis.<br /> 
          This places me in the top 2% of graduates in my year.<br /><br />
          See more at my {' '}
          <a 
            href="https://www.linkedin.com/feed/update/urn:li:activity:7399870649738973184/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-pink-600 hover:text-pink-800 underline"
          >
            LinkedIn Post
          </a>
        </>
      )
    }
  ];

  return (
    <section id="awards" className="w-full min-h-screen py-20 bg-gradient-to-b from-pink-50 to-white">
      <div className="w-3/4 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-pink-900">Awards & Honors</h2>

        {/* FULL-WIDTH SINGLE COLUMN CARD */}
        <div className="grid gap-6 md:grid-cols-1">
          {awards.map((award, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition w-full">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-semibold mb-2 text-pink-900">{award.title}</h3>
              <p className="text-gray-700 font-medium mb-2">{award.organization}</p>
              <p className="text-gray-600 mb-4">{award.year}</p>
              <p className="text-gray-700 leading-relaxed">{award.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ====================================================================
// ABOUT ME COMPONENT
// ====================================================================
const AboutMe = () => {
  const bio = (
    <>
      I'm from the countryside and grew up between horses and trees.<br />
      As such, I like spending my free time outdoors, preferably hiking up a mountain.<br /><br />
      I moved to Copenhagen at the start of my bachelor's degree and really fell in love with the city.<br />
      During my studies, I became very involved in the student community. For example, by volunteering as a tutor for four years.
    </>
  );

  const images = [
    { src: '/images/1.jpg' },
    { src: '/images/2.jpg' },
    { src: '/images/3.jpg' },
    { src: '/images/4.jpg' },
    { src: '/images/5.jpg' },
  ];

  return (
    <section id="about" className="w-full min-h-screen py-20 bg-gradient-to-b from-pink-50 to-white snap-start">
      <div className="w-3/4 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-pink-900">About Me</h2>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* BIO */}
          <div className="text-gray-700 leading-relaxed text-lg">{bio}</div>

          {/* IMAGE GRID */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="w-full h-40 md:h-48 lg:h-56 overflow-hidden rounded-lg shadow-md">
                <img src={img.src} alt={`About me ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


// ====================================================================
// CONTACT COMPONENT
// ====================================================================
const Contact = () => {
  const contactInfo = {
    email: 'victorpvrothe@gmail.com',
    linkedin: 'linkedin.com/in/victor-varming',
    github: 'github.com/victor-varming',
    location: 'Copenhagen, Denmark'
  };

  return (
    <section id="contact" className="w-full min-h-screen py-20 bg-gradient-to-b from-teal-50 to-white">
      <div className="w-3/4 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-teal-900">Contact</h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-xl text-gray-700 mb-8">
            I'm always interested in new opportunities and collaborations. Feel free to reach out!
          </p>
          <div className="space-y-4">
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-lg text-teal-700 hover:text-teal-900">
              <Mail size={24} /> {contactInfo.email}
            </a>
            <a href={`https://${contactInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg text-teal-700 hover:text-teal-900">
              <Linkedin size={24} /> {contactInfo.linkedin}
            </a>
            <a href={`https://${contactInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg text-teal-700 hover:text-teal-900">
              <Github size={24} /> {contactInfo.github}
            </a>
            <p className="flex items-center gap-3 text-lg text-gray-700">
              <span className="text-2xl">📍</span> {contactInfo.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ====================================================================
// MAIN APP WRAP
// ====================================================================
export default function App() {
  const [activeSection, setActiveSection] = useState('start');

  const sections = [
    { id: 'resume', title: 'Resumé', color: '#93c5fd' },
    { id: 'science-comm', title: 'Scientific\nCommunication', color: '#86efac' },
    { id: 'code-snippets', title: 'Code Snippets', color: '#c4b5fd' },
    { id: 'publications', title: 'Publications', color: '#fb923c' },
    { id: 'awards', title: 'Awards', color: '#f472b6' },
    { id: 'about', title: 'About Me', color: '#facc15' },
    { id: 'contact', title: 'Contact', color: '#14b8a6' },
  ];
  

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) => document.getElementById(s.id));
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white snap-y snap-mandatory overflow-y-scroll h-screen">
      <Navigation activeSection={activeSection} sections={sections} />
      <main className="snap-y snap-mandatory">
        <Hero />
        <Resume />
        <ScienceCommunication />
        <CodeSnippets snippets={snippets} />
        <Publications />
        <Awards />
        <AboutMe />
        <Contact />
      </main>
    </div>
  );
}