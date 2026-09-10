export const SAMPLE_JOB_DESCRIPTION = `Job Title: Senior Full Stack Engineer (TypeScript / React / Node.js)
Company: CloudScale Technologies
Location: Remote / Hybrid
Job Type: Full-time

About the Role:
We are looking for a Senior Full Stack Engineer to build high-performance, real-time cloud web applications. You will architect scalable backend microservices, implement modern React responsive interfaces, and deploy cloud infrastructure on AWS.

Required Technical Skills & Qualifications:
- 5+ years of software engineering experience in full-stack web development.
- Strong proficiency in TypeScript and modern JavaScript (ES6+).
- Advanced expertise in React (Hooks, Context, State Management, Vite or Next.js).
- Proven experience building RESTful and GraphQL APIs using Node.js and Express or NestJS.
- Production experience with PostgreSQL, relational database schema design, indexing, and query optimization.
- Hands-on experience with Docker containerization and AWS cloud services (ECS, S3, RDS, Lambda).
- Experience setting up CI/CD deployment pipelines (GitHub Actions, GitLab CI, or Jenkins).
- Bachelor's Degree in Computer Science, Software Engineering, or equivalent practical experience.

Preferred / Nice to Have:
- Experience with Redis caching and distributed task queues.
- Familiarity with Tailwind CSS and responsive design principles.
- AWS Certified Developer or Solutions Architect certification.
- Background in automated testing (Jest, Cypress, Playwright).

Responsibilities:
- Architect and deliver end-to-end features across client and server layers.
- Optimize database queries and API response times for high-volume transactions.
- Mentor junior and mid-level engineers through code reviews and technical guidance.
- Collaborate with product designers and engineering managers in agile sprints.`;

export const SAMPLE_RESUME_1 = `ALEXANDER RIVERA
Email: alex.rivera@email.com | Phone: (555) 234-5678 | San Francisco, CA
LinkedIn: linkedin.com/in/alex-rivera-dev | GitHub: github.com/alexrivera

PROFESSIONAL SUMMARY
Senior Full Stack Software Engineer with 6+ years of professional experience designing, building, and deploying scalable web applications using TypeScript, React, Node.js, and AWS. Strong expertise in PostgreSQL database modeling, Docker microservices, and CI/CD pipelines. Led engineering teams of 5 engineers to deliver high-throughput cloud platforms.

WORK EXPERIENCE
Senior Full Stack Developer | Apex Cloud Systems | San Francisco, CA
March 2021 – Present
- Architected enterprise SaaS platform using TypeScript, React 18, and Node.js/Express, supporting 150,000+ daily active users.
- Designed relational database schemas in PostgreSQL with complex indexing and partitioning, reducing query latency by 42%.
- Built containerized microservices using Docker and orchestrated deployments on AWS ECS, S3, and RDS.
- Implemented automated CI/CD workflows using GitHub Actions for automated unit testing (Jest) and zero-downtime production releases.
- Mentored 4 mid-level developers and established TypeScript strict coding standards across the organization.

Full Stack Software Engineer | Horizon Fintech | Austin, TX
July 2018 – February 2021
- Developed responsive customer dashboard in React and Tailwind CSS, improving load times by 35%.
- Implemented RESTful APIs and webhook services in Node.js connected to PostgreSQL and Redis caches.
- Managed AWS infrastructure utilizing CloudWatch, S3, and Lambda serverless functions.
- Wrote end-to-end tests using Cypress and unit test suites with Jest, achieving 88% code coverage.

EDUCATION & CERTIFICATIONS
- B.S. in Computer Science | University of Texas at Austin (2014 – 2018)
- AWS Certified Solutions Architect – Associate (2022)

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), SQL, HTML5, CSS3
- Frontend: React, Redux Toolkit, Vite, Tailwind CSS, Next.js
- Backend: Node.js, Express, NestJS, REST APIs, GraphQL
- Databases & Caching: PostgreSQL, Redis, MongoDB
- Cloud & DevOps: AWS (ECS, RDS, S3, Lambda), Docker, GitHub Actions, CI/CD, Git
- Testing: Jest, Cypress, Supertest`;

export const SAMPLE_RESUME_2 = `PRIYA PATEL
Email: priya.patel@email.com | Phone: (555) 876-5432 | Seattle, WA
Portfolio: priyapatel.dev | LinkedIn: linkedin.com/in/priyapatel-ui

PROFESSIONAL SUMMARY
Frontend-focused Software Engineer with 4 years of experience building modern, responsive web applications using React, JavaScript, and TypeScript. Solid foundation in UI/UX architecture, state management, and API integrations with Node.js backends. Seeking to transition into a full-stack capacity.

WORK EXPERIENCE
Frontend Engineer | Lumina Digital | Seattle, WA
January 2022 – Present
- Built and maintained customer-facing web applications using React, TypeScript, and Tailwind CSS.
- Integrated RESTful APIs developed in Node.js and Express, handling asynchronous data fetching and error states.
- Utilized Redux Toolkit and React Query for client-side state caching and pagination.
- Collaborated with UI/UX designers to implement pixel-perfect Figma prototypes with WCAG AA accessibility.
- Wrote unit tests using Jest and React Testing Library for reusable UI component libraries.

Junior Web Developer | PixelCraft Solutions | Seattle, WA
June 2020 – December 2021
- Developed interactive web pages using JavaScript, HTML5, CSS3, and React.
- Connected frontend interfaces to basic Node.js backend endpoints and SQLite/PostgreSQL databases.
- Assisted in manual QA testing and tracked bugs using Jira and GitHub.

EDUCATION & SKILLS
- B.S. in Information Technology | University of Washington (2016 – 2020)
- Technical Skills: JavaScript, TypeScript, React, HTML5, CSS3, Tailwind CSS, Redux, Node.js (intermediate), PostgreSQL (basic querying), Git, Jest, Figma
- Gaps / Currently Learning: Docker containerization, AWS cloud services, advanced database optimization, CI/CD pipeline automation`;

export const SAMPLE_RESUME_3 = `MARCUS VANCE
Email: marcus.vance@email.com | Phone: (555) 987-1234 | Chicago, IL
LinkedIn: linkedin.com/in/marcus-vance-data

PROFESSIONAL SUMMARY
Backend Python Developer with 3 years of experience developing REST APIs, ETL data pipelines, and automation scripts using Python, Django, and MySQL. Experienced in Linux system administration and basic data analysis.

WORK EXPERIENCE
Backend Python Developer | DataSphere Analytics | Chicago, IL
August 2021 – Present
- Developed RESTful API endpoints using Python and Django REST Framework for internal data tools.
- Maintained relational database tables in MySQL, writing SQL queries and stored procedures.
- Created automated data ingestion scripts with Pandas and Celery for scheduled batch jobs.
- Managed server deployments on on-premises Linux Ubuntu virtual machines.

Junior Systems Programmer | Midwest IT Services | Chicago, IL
May 2020 – July 2021
- Wrote Python automation scripts for routine system health checks and log monitoring.
- Assisted with database backups and basic bash scripting.

EDUCATION & SKILLS
- B.A. in Mathematics | University of Illinois at Chicago (2016 – 2020)
- Technical Skills: Python, Django, Flask, MySQL, SQLite, Linux/Bash, Git, Pandas, REST APIs
- Note: Minimal professional experience with TypeScript, React, Node.js, AWS, or Docker.`;

export const SAMPLE_ANALYSIS_RESULT: import('../types').AnalysisResult = {
  jobTitle: "Senior Full Stack Engineer (TypeScript / React / Node.js)",
  jobDescriptionSummary: "CloudScale Technologies is seeking a Senior Full Stack Engineer with 5+ years of experience to build high-performance cloud applications utilizing TypeScript, React, Node.js, PostgreSQL, Docker, and AWS services.",
  timestamp: new Date().toISOString(),
  shortlistRecommendation: {
    recommendedCandidateNames: ["Alexander Rivera"],
    explanation: "Alexander Rivera demonstrates exceptional alignment with all required core criteria (6+ years full-stack, TypeScript, React 18, Node.js microservices, PostgreSQL query optimization, AWS ECS/RDS/S3, and automated CI/CD pipelines). Priya Patel is a promising candidate for frontend-heavy positions but has critical gaps in AWS, Docker, and backend architectural depth. Marcus Vance has virtually zero alignment with the JavaScript/TypeScript ecosystem."
  },
  generalAtsTips: [
    {
      title: "Use the XYZ Accomplishment Formula",
      category: "Relevant Experience (25% Weight)",
      tip: "Format bullet points as: 'Accomplished [X], as measured by [Y], by doing [Z]'. ATS systems and hiring managers look for quantifiable metrics (e.g., latency reduction, revenue growth, active users) rather than generic duties.",
      impact: "+10 to +15 Points"
    },
    {
      title: "Mirror Exact Core Technical Terms",
      category: "Required Skills (40% Weight)",
      tip: "If the JD asks for 'TypeScript' and 'PostgreSQL query optimization', do not just write 'JavaScript' or 'SQL'. Modern ATS parsers scan for specific skill entities and check for frequency and recency.",
      impact: "+15 to +20 Points"
    },
    {
      title: "Target the Professional Summary to the Exact Role",
      category: "Role Alignment (20% Weight)",
      tip: "Lead your resume with a 3-sentence summary incorporating the exact target role title (e.g., 'Senior Full Stack Engineer') and highlighting your years of experience in the target stack.",
      impact: "+8 to +12 Points"
    },
    {
      title: "Ditch Tables, Text Boxes & Multi-Column Graphics",
      category: "ATS Parser Formatting",
      tip: "Many legacy and modern ATS parsers read left-to-right across columns, jumbling text in multi-column tables. Use clean single-column layouts with standard headings like 'WORK EXPERIENCE', 'EDUCATION', and 'TECHNICAL SKILLS'.",
      impact: "Prevents Complete Parsing Failure"
    },
    {
      title: "Feature Certifications in Dedicated Section",
      category: "Education & Qualifications (10% Weight)",
      tip: "List official cloud or professional credentials (e.g., 'AWS Certified Solutions Architect') with issuing year and license ID so automated credential scrapers verify them instantly.",
      impact: "+5 to +8 Points"
    }
  ],
  ranking: [
    {
      rank: 1,
      candidateName: "Alexander Rivera",
      atsScore: 94,
      skillMatch: 95,
      alignment: "Excellent",
      keyStrengths: "6+ years full-stack, strong TypeScript, React 18, PostgreSQL indexing, Docker, AWS ECS/RDS, AWS certified."
    },
    {
      rank: 2,
      candidateName: "Priya Patel",
      atsScore: 68,
      skillMatch: 65,
      alignment: "Moderate",
      keyStrengths: "Solid 4 years modern React, TypeScript, Tailwind, UI testing; needs backend depth, AWS, and Docker."
    },
    {
      rank: 3,
      candidateName: "Marcus Vance",
      atsScore: 36,
      skillMatch: 25,
      alignment: "Weak",
      keyStrengths: "Competent Python/Django developer, but lacks virtually all required TypeScript, React, and AWS capabilities."
    }
  ],
  candidates: [
    {
      candidateId: "cand_alex_rivera",
      candidateName: "Alexander Rivera",
      atsScore: 94,
      scoreBreakdown: {
        requiredSkills: 38,
        relevantExperience: 24,
        roleAlignment: 19,
        educationQualifications: 9,
        relevantKeywords: 4,
        explanation: "Exceptional alignment across all dimensions. Alexander has 6+ years of full-stack engineering experience, directly matching the 5+ years requirement. Proven mastery in TypeScript, React, Node.js, PostgreSQL, Docker, and AWS with quantifiable production achievements."
      },
      skillSetMatch: {
        percentage: 95,
        matched: [
          "TypeScript",
          "React (Hooks, Vite, Redux)",
          "Node.js / Express",
          "PostgreSQL (Schema Design & Optimization)",
          "Docker Containerization",
          "AWS (ECS, RDS, S3, Lambda)",
          "CI/CD (GitHub Actions)",
          "REST APIs",
          "GraphQL",
          "Automated Testing (Jest, Cypress)"
        ],
        partiallyMatched: ["Redis Caching (used at Horizon Fintech, minor recency check)"],
        missing: [],
        technicalSkills: ["TypeScript", "JavaScript", "SQL", "React", "Node.js", "Express", "NestJS", "PostgreSQL", "GraphQL"],
        toolsAndPlatforms: ["AWS", "Docker", "GitHub Actions", "Redis", "Cypress", "Jest", "Vite", "Tailwind CSS"]
      },
      alignment: "Excellent",
      alignmentExplanation: "Direct 1:1 match with the Senior Full Stack Engineer role. Has built scalable SaaS platforms supporting 150k+ daily users, managed AWS infrastructure, led engineering code reviews, and holds an AWS Solutions Architect certification.",
      alignmentFactors: {
        jobRole: "Senior Full Stack Engineer (6+ years vs 5+ required)",
        responsibilities: "Architecting end-to-end features, optimizing database latency (-42%), mentoring junior engineers",
        experience: "6 years at Apex Cloud Systems and Horizon Fintech",
        projects: "Enterprise SaaS platform, high-throughput financial dashboards, microservices",
        technologies: "TypeScript, React 18, Node.js, Express, PostgreSQL, Docker, AWS ECS/RDS/S3, GitHub Actions",
        education: "B.S. in Computer Science (University of Texas at Austin)",
        certifications: "AWS Certified Solutions Architect – Associate (2022)"
      },
      missingGaps: {
        high: [],
        medium: [],
        low: ["Minor: Could explicitly highlight NestJS production microservice patterns"]
      },
      recommendedCourses: [
        {
          courseOrTopic: "Advanced Distributed Systems & Microservices Architecture on AWS",
          reason: "To further sharpen high-throughput event-driven patterns with Kafka/SQS for senior leadership.",
          priority: "LOW"
        }
      ],
      scoreBoosterTips: [
        {
          category: "Relevant Keywords (5% Weight)",
          currentGap: "Has strong achievements but could weave target architectural buzzwords like 'Microservices Event Mesh' or 'Zero-Downtime Blue/Green Deployments'.",
          actionableTip: "Add 1 bullet point specifically detailing the deployment strategy used with GitHub Actions.",
          potentialPoints: 3,
          exampleRewrite: "Change: 'Implemented automated CI/CD workflows' → To: 'Engineered zero-downtime blue/green CI/CD deployment pipelines on AWS ECS via GitHub Actions, decreasing release cycle times by 65%'."
        },
        {
          category: "Role Alignment (20% Weight)",
          currentGap: "Summary emphasizes development; could emphasize cross-functional system architecture and product ownership.",
          actionableTip: "Include an explicit mention of Agile/Scrum cross-functional collaboration with product design in the professional summary.",
          potentialPoints: 3,
          exampleRewrite: "Add to Summary: 'Proven track record partnering with product management to define technical roadmaps and deliver resilient cloud solutions'."
        }
      ]
    },
    {
      candidateId: "cand_priya_patel",
      candidateName: "Priya Patel",
      atsScore: 68,
      scoreBreakdown: {
        requiredSkills: 27,
        relevantExperience: 18,
        roleAlignment: 13,
        educationQualifications: 7,
        relevantKeywords: 3,
        explanation: "Solid frontend foundation with React, TypeScript, and Tailwind CSS. However, this is a Senior Full Stack role: candidate only has 4 years total experience (below 5+ requirement), lacks hands-on AWS cloud deployment experience, and has limited backend database architectural exposure."
      },
      skillSetMatch: {
        percentage: 65,
        matched: [
          "React (Hooks, State Management)",
          "TypeScript",
          "JavaScript (ES6+)",
          "Tailwind CSS",
          "REST APIs (consuming & basic endpoints)",
          "Jest Unit Testing"
        ],
        partiallyMatched: [
          "Node.js & Express (intermediate API integration, but no complex architecture)",
          "PostgreSQL (basic querying only, lacks indexing/schema design experience)"
        ],
        missing: [
          "5+ years experience requirement (candidate has 4 years)",
          "AWS Cloud Infrastructure (ECS, RDS, S3, Lambda)",
          "Docker Containerization",
          "CI/CD Pipeline Configuration (GitHub Actions/Jenkins)",
          "GraphQL"
        ],
        technicalSkills: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Basic Node.js"],
        toolsAndPlatforms: ["Git", "Jest", "React Testing Library", "Figma"]
      },
      alignment: "Moderate",
      alignmentExplanation: "Good frontend engineering foundation with React and TypeScript, but lacks the requisite senior-level backend microservice and AWS cloud deployment skills needed for this full-stack role.",
      alignmentFactors: {
        jobRole: "Frontend Engineer seeking transition to Senior Full Stack",
        responsibilities: "UI component design, frontend state management, consuming REST APIs",
        experience: "4 years experience (2 yrs at Lumina Digital, 1.5 yrs at PixelCraft)",
        projects: "Customer dashboards, reusable design systems, Figma conversions",
        technologies: "React, TypeScript, Tailwind, Redux, Node.js (intermediate)",
        education: "B.S. in Information Technology (University of Washington)",
        certifications: "None listed"
      },
      missingGaps: {
        high: [
          "Hands-on AWS Cloud Architecture (ECS, S3, RDS, Lambda)",
          "Production Docker Containerization experience",
          "Advanced PostgreSQL schema modeling and query optimization"
        ],
        medium: [
          "Senior seniority requirement (4 years vs 5+ required)",
          "CI/CD automated pipeline setup (GitHub Actions / Jenkins)"
        ],
        low: [
          "GraphQL schema creation and resolvers"
        ]
      },
      recommendedCourses: [
        {
          courseOrTopic: "AWS Cloud Practitioner & Developer Associate Hands-On Certification",
          reason: "Directly bridges the critical gap in AWS cloud infrastructure required by the JD.",
          priority: "HIGH"
        },
        {
          courseOrTopic: "Docker & Kubernetes: The Practical Containerization Guide",
          reason: "Teaches microservice packaging and container deployment mandated by the role.",
          priority: "HIGH"
        },
        {
          courseOrTopic: "Production Node.js & Advanced PostgreSQL for Full Stack Developers",
          reason: "Expands backend capability from basic API routing to relational database indexing, transactions, and scaling.",
          priority: "MEDIUM"
        }
      ],
      scoreBoosterTips: [
        {
          category: "Required Skills (40% Weight)",
          currentGap: "Resume mentions 'assisted with backend endpoints' which sounds junior and lacks technical keywords.",
          actionableTip: "Rewrite backend experience to highlight specific technologies (e.g. Node.js, Express, PostgreSQL ORM) and mention containerization projects.",
          potentialPoints: 12,
          exampleRewrite: "Change: 'Connected frontend interfaces to basic Node.js backend endpoints and SQLite/PostgreSQL databases' → To: 'Developed Node.js/Express REST microservices and designed relational PostgreSQL tables, writing optimized SQL joins and query indexes'."
        },
        {
          category: "Relevant Experience (25% Weight)",
          currentGap: "Bulleted points are duty-focused rather than result-focused. Missing quantifiable metrics.",
          actionableTip: "Add quantifiable impact (percentage improvements, latency reductions, user counts) to every bullet point.",
          potentialPoints: 8,
          exampleRewrite: "Change: 'Built and maintained customer-facing web applications using React' → To: 'Architected modular React/TypeScript web app serving 40,000+ monthly users, reducing bundle load time by 38% via code splitting and memoization'."
        },
        {
          category: "Education & Qualifications (10% Weight)",
          currentGap: "Zero certifications listed; JD lists AWS Certified Solutions Architect as preferred.",
          actionableTip: "Complete and display AWS Certified Cloud Practitioner or Developer Associate.",
          potentialPoints: 6,
          exampleRewrite: "Add to Certifications: 'AWS Certified Developer – Associate (In Progress / Completed)'."
        }
      ]
    },
    {
      candidateId: "cand_marcus_vance",
      candidateName: "Marcus Vance",
      atsScore: 36,
      scoreBreakdown: {
        requiredSkills: 10,
        relevantExperience: 11,
        roleAlignment: 8,
        educationQualifications: 5,
        relevantKeywords: 2,
        explanation: "Significant technical misalignment. Candidate is a Python/Django/MySQL backend developer with no demonstrable experience in TypeScript, modern JavaScript, React, or AWS cloud services. Only 3 years total experience versus 5+ required."
      },
      skillSetMatch: {
        percentage: 25,
        matched: [
          "REST APIs",
          "Relational Database concepts (MySQL)",
          "Git Version Control"
        ],
        partiallyMatched: [
          "SQL database querying (MySQL instead of required PostgreSQL)"
        ],
        missing: [
          "TypeScript / JavaScript (ES6+)",
          "React (Hooks, Context, State Management)",
          "Node.js / Express / NestJS",
          "PostgreSQL",
          "AWS Cloud Services (ECS, S3, RDS, Lambda)",
          "Docker Containerization",
          "CI/CD Pipelines",
          "Senior level experience (3 yrs vs 5+ required)"
        ],
        technicalSkills: ["Python", "Django", "Flask", "MySQL", "Pandas", "Linux/Bash"],
        toolsAndPlatforms: ["Git", "Celery", "Ubuntu"]
      },
      alignment: "Weak",
      alignmentExplanation: "Candidate profile does not match the target full-stack JavaScript/TypeScript engineering role. Experience is strictly Python scripting and Django backend on on-premise Linux VMs.",
      alignmentFactors: {
        jobRole: "Backend Python Developer applying for Senior Full Stack (TS/React/Node)",
        responsibilities: "Writing Python data scripts, MySQL tables, Celery jobs",
        experience: "3 years experience (DataSphere Analytics & Midwest IT)",
        projects: "Internal ETL pipelines, system health check scripts",
        technologies: "Python, Django, Flask, MySQL, Bash",
        education: "B.A. in Mathematics (University of Illinois at Chicago)",
        certifications: "None"
      },
      missingGaps: {
        high: [
          "Core Language Stack: TypeScript & JavaScript",
          "Frontend Framework: React (Hooks, state management)",
          "Backend Runtime: Node.js & Express",
          "Cloud Platform: AWS (ECS, RDS, S3)",
          "Containers: Docker"
        ],
        medium: [
          "Database: PostgreSQL (candidate only has MySQL)",
          "Seniority: 3 years vs 5+ required"
        ],
        low: [
          "Automated frontend testing (Jest, Cypress)"
        ]
      },
      recommendedCourses: [
        {
          courseOrTopic: "Complete TypeScript & Modern JavaScript Masterclass",
          reason: "Fundamental requirement for any React/Node.js full-stack role.",
          priority: "HIGH"
        },
        {
          courseOrTopic: "React 18 & Full-Stack Node.js Development Boot Camp",
          reason: "Required to bridge the complete absence of React and Node.js in candidate's experience.",
          priority: "HIGH"
        },
        {
          courseOrTopic: "AWS Cloud & Docker Microservices Fundamentals",
          reason: "Required cloud deployment stack specified by the Job Description.",
          priority: "HIGH"
        }
      ],
      scoreBoosterTips: [
        {
          category: "Role Alignment & Target Positioning",
          currentGap: "Resume describes a Python Data Developer. ATS automatically penalizes when target JD role is Senior Full Stack (TS/React).",
          actionableTip: "Create a separate dedicated Full-Stack Resume version highlighting any JavaScript, web UI, or modern API work.",
          potentialPoints: 15,
          exampleRewrite: "Change Title: 'Backend Python Developer' → To: 'Full Stack Software Engineer | Python, JavaScript & Cloud APIs'."
        },
        {
          category: "Required Skills (40% Weight)",
          currentGap: "Zero mentions of TypeScript or React anywhere in work experience.",
          actionableTip: "Build and document at least 1 production-grade full-stack portfolio project built with TypeScript, React, and Node.js.",
          potentialPoints: 18,
          exampleRewrite: "Add Project: 'CloudScale Clone: Architected full-stack TypeScript/React application with Node.js microservices and PostgreSQL database, containerized in Docker'."
        }
      ]
    }
  ],
  rawMarkdownReport: `# ATS ANALYSIS

## Candidate 1 — Alexander Rivera

### 1. ATS Compatibility Score
94/100

### 2. Skill Set Match
95%

Matched:
- TypeScript
- React (Hooks, Vite, Redux)
- Node.js / Express
- PostgreSQL (Schema Design & Optimization)
- Docker Containerization
- AWS (ECS, RDS, S3, Lambda)
- CI/CD (GitHub Actions)
- REST APIs & GraphQL
- Automated Testing (Jest, Cypress)

Partially Matched:
- Redis Caching

Missing:
- None (Core requirements fully verified)

### 3. Resume–JD Alignment
Excellent

Explanation:
Direct 1:1 match with the Senior Full Stack Engineer role. Has built scalable SaaS platforms supporting 150k+ daily users, managed AWS infrastructure, led engineering code reviews, and holds an AWS Solutions Architect certification.

### 4. What's Missing

HIGH:
- None identified

MEDIUM:
- None identified

LOW:
- Minor: Could explicitly highlight NestJS production microservice patterns

### 5. Recommended Courses

1. Advanced Distributed Systems & Microservices Architecture on AWS
   Reason: To further sharpen high-throughput event-driven patterns with Kafka/SQS for senior leadership.

---

## Candidate 2 — Priya Patel

### 1. ATS Compatibility Score
68/100

### 2. Skill Set Match
65%

Matched:
- React (Hooks, State Management)
- TypeScript
- JavaScript (ES6+)
- Tailwind CSS
- REST APIs
- Jest Testing

Partially Matched:
- Node.js & Express (basic routing)
- PostgreSQL (basic querying)

Missing:
- AWS Cloud Services (ECS, RDS, S3, Lambda)
- Docker Containerization
- CI/CD Pipelines
- 5+ years experience (Candidate has 4 years)

### 3. Resume–JD Alignment
Moderate

Explanation:
Good frontend engineering foundation with React and TypeScript, but lacks the requisite senior-level backend microservice and AWS cloud deployment skills needed for this full-stack role.

### 4. What's Missing

HIGH:
- Hands-on AWS Cloud Architecture (ECS, S3, RDS, Lambda)
- Production Docker Containerization
- Advanced PostgreSQL schema modeling and query optimization

MEDIUM:
- Senior seniority requirement (4 years vs 5+ required)
- CI/CD automated pipeline setup (GitHub Actions)

LOW:
- GraphQL schema creation

### 5. Recommended Courses

1. AWS Cloud Practitioner & Developer Associate Certification
   Reason: Directly bridges the critical gap in AWS cloud infrastructure required by the JD.

2. Docker & Kubernetes: The Practical Containerization Guide
   Reason: Teaches microservice packaging and container deployment mandated by the role.

---

## Candidate 3 — Marcus Vance

### 1. ATS Compatibility Score
36/100

### 2. Skill Set Match
25%

Matched:
- REST APIs
- Relational Database concepts (MySQL)
- Git Version Control

Partially Matched:
- SQL database querying (MySQL vs PostgreSQL)

Missing:
- TypeScript & JavaScript
- React
- Node.js / Express
- PostgreSQL
- AWS Cloud Services
- Docker

### 3. Resume–JD Alignment
Weak

Explanation:
Candidate profile does not match the target full-stack JavaScript/TypeScript engineering role. Experience is strictly Python scripting and Django backend on on-premise Linux VMs.

### 4. What's Missing

HIGH:
- Core Language Stack: TypeScript & JavaScript
- Frontend Framework: React
- Backend Runtime: Node.js
- Cloud Platform: AWS
- Containers: Docker

MEDIUM:
- Database: PostgreSQL (candidate only has MySQL)
- Seniority: 3 years vs 5+ required

LOW:
- Automated frontend testing

### 5. Recommended Courses

1. Complete TypeScript & Modern JavaScript Masterclass
   Reason: Fundamental requirement for any React/Node.js full-stack role.

2. React 18 & Full-Stack Node.js Development Boot Camp
   Reason: Required to bridge the complete absence of React and Node.js in candidate's experience.

---

# FINAL RANKING

| Rank | Candidate | ATS Score | Skill Match | Alignment |
|------|-----------|-----------|-------------|-----------|
| 1 | Alexander Rivera | 94/100 | 95% | Excellent |
| 2 | Priya Patel | 68/100 | 65% | Moderate |
| 3 | Marcus Vance | 36/100 | 25% | Weak |

# SHORTLIST RECOMMENDATION

Alexander Rivera is the only candidate ready for immediate shortlisting for the Senior Full Stack Engineer role. He meets or exceeds every required technical skill, possesses production AWS deployment experience, and demonstrates strong database optimization leadership. Priya Patel should be retained for Mid-Level Frontend openings, and Marcus Vance should be redirected to Python/Data engineering pipelines.`
};

