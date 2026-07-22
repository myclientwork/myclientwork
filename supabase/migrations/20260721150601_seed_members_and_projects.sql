/*
# Seed team members and real projects

1. Data inserted
- Two members: Sandip Kumar Sah and Bikash Kushwaha, with real skills, links, certifications, and achievements from their resumes.
- Three published projects: TaskFlow, KIITGO (Sandip's), and SecureDrive (Bikash's research project), with accurate problem/solution/outcome and technologies.
- project_members rows crediting each member on their projects.

2. Security
- No policy changes. All inserts run with service role; existing public read policies apply.

3. Notes
- Slugs are stable and URL-friendly.
- All projects are PUBLISHED so they appear publicly.
- display_order controls listing order; featured flags highlight selected projects.
*/

-- Sandip Kumar Sah
INSERT INTO members (slug, full_name, title, bio, experience_summary, location, email, phone, linkedin_url, github_url, portfolio_url, avatar_url, skills, certifications, achievements, availability_status, display_order)
VALUES (
  'sandip-kumar-sah',
  'Sandip Kumar Sah',
  'Full Stack Developer (MERN)',
  'Full Stack Developer with hands-on experience building MERN stack applications used by 5,000+ real users. Skilled in React.js, Node.js, Express.js, MongoDB, and TypeScript, with a solid understanding of RESTful APIs, authentication (JWT, RBAC), and cloud deployment (AWS, Vercel). I enjoy turning ideas into clean, working products.',
  'B.Tech CSE at KIIT University (GPA 8.84/10). Built and shipped 2 production-grade full-stack applications serving 5,000+ real users, managing the complete SDLC from system design to deployment.',
  'Bhubaneswar, Odisha, India',
  'sandipcloud26@gmail.com',
  '+91-8114890532',
  'https://linkedin.com/in/Sandip4083',
  'https://github.com/Sandip4083',
  'https://sandip-portfolio.vercel.app',
  'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['JavaScript','TypeScript','React.js','Node.js','Express.js','MongoDB','MySQL','RESTful APIs','JWT','RBAC','AWS (EC2, S3)','Docker','Vercel','Tailwind CSS','Python','C','SQL'],
  ARRAY['DevOps & Cloud Automation — AICTE EduSkills (Jun 2026)','Full-Stack (MERN) Software Developer — AICTE EduSkills (Mar 2025)'],
  ARRAY['Engineered and deployed 2 production-grade full-stack applications serving 5,000+ real users','Achieved 8.84 GPA at KIIT University while shipping industry-level projects','Actively solving DSA problems'],
  'available',
  1
)
ON CONFLICT (slug) DO NOTHING;

-- Bikash Kushwaha
INSERT INTO members (slug, full_name, title, bio, experience_summary, location, email, phone, linkedin_url, github_url, portfolio_url, avatar_url, skills, certifications, achievements, availability_status, display_order)
VALUES (
  'bikash-kushwaha',
  'Bikash Kushwaha',
  'Full Stack Developer & Security Engineer',
  'Full Stack Developer and security researcher with expertise across MERN, Java Spring Boot, Angular, Flutter, and cloud-native DevOps on Azure. Experienced in building secure, scalable systems including Zero Trust IAM, client-side encrypted storage, and AI-driven access control. CGPA 8.71/10 at KIIT University.',
  'B.Tech CSE at KIIT University (CGPA 8.71/10). Built a Zero Trust IAM prototype achieving 0.91 F1-score and 97% attack blocking, and a browser-native secure cloud storage framework validated with ProVerif.',
  'Bhubaneswar, Odisha, India',
  'bikashkushwaha31@gmail.com',
  '+91-9124277838',
  'https://linkedin.com/in/kushwahabikash',
  NULL,
  NULL,
  'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Python','Java','JavaScript','TypeScript','Dart','C','SQL','React.js','Node.js','Express.js','Flutter','Spring Boot','Angular','Flask','MongoDB','MySQL','Microsoft Azure','Azure DevOps','Docker','AWS','GitHub Actions','CI/CD','Power BI','Tableau','TensorFlow','Scikit-learn','Machine Learning','Cybersecurity','IAM','Zero Trust'],
  ARRAY['Microsoft Certified: Azure Fundamentals (AZ-900) — Oct 2022','AZ-400: Designing and Implementing Microsoft DevOps Solutions — Aug 2023','Full Stack Development using MERN Stack — ASD, Jul 2025','Data Engineering — ExcelR, 2025','Full Stack Development (Java Spring Boot & Angular) — ExcelR, 2025','Palo Alto Networks Cybersecurity Fundamentals — 2025','IBM/Coursera Data Science Professional Coursework'],
  ARRAY['Built a Zero Trust IAM prototype with 0.91 F1-score, 97% attack blocking, 92% false-positive reduction','SecureDrive research validated with ProVerif; journal manuscript in progress','NSS digital literacy workshops and peer mentoring'],
  'available',
  2
)
ON CONFLICT (slug) DO NOTHING;

-- TaskFlow project (Sandip)
INSERT INTO projects (slug, title, short_summary, problem, solution, outcome, body, category, technologies, demo_url, source_code_url, cover_image_url, completion_date, status, featured, display_order, seo_title, seo_description)
VALUES (
  'taskflow',
  'TaskFlow — Full-Stack Project Management Platform',
  'A Kanban project management web app with drag-and-drop tasks, team collaboration, role-based access control, and an analytics dashboard.',
  'Teams needed a clean, responsive way to manage projects visually with Kanban boards, track progress, and collaborate without the overhead of heavyweight enterprise tools.',
  'Built a full-stack MERN application with drag-and-drop Kanban boards, JWT authentication, role-based access control, analytics dashboard, calendar view, real-time notifications, and CSV export. Backend optimized with MongoDB indexing and query optimization; frontend uses lazy loading for performance.',
  'Delivered a production-deployed platform on Vercel with fast response times, secure auth, and improved team productivity through analytics and real-time updates.',
  'TaskFlow is a full-stack Kanban project management platform built with the MERN stack. Key features include drag-and-drop task management, team collaboration, secure JWT login with RBAC and password hashing, an analytics dashboard, calendar view, real-time notifications, and CSV export. The frontend uses lazy loading for performance and the backend is optimized with MongoDB indexing and query optimization to reduce API response time for large datasets. Deployed on Vercel.',
  'Web Application',
  ARRAY['React.js','Node.js','Express.js','MongoDB','JWT','RBAC','Tailwind CSS','Vercel'],
  'https://taskflow-inky-theta.vercel.app',
  NULL,
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '2025-12-01',
  'PUBLISHED',
  true,
  1,
  'TaskFlow — Full-Stack Project Management Platform | Our Team',
  'TaskFlow is a Kanban project management web app built with the MERN stack featuring drag-and-drop tasks, RBAC, analytics, and real-time notifications.'
)
ON CONFLICT (slug) DO NOTHING;

-- KIITGO project (Sandip)
INSERT INTO projects (slug, title, short_summary, problem, solution, outcome, body, category, technologies, demo_url, source_code_url, cover_image_url, completion_date, status, featured, display_order, seo_title, seo_description)
VALUES (
  'kiitgo',
  'KIITGO — Smart Bus Service Management System',
  'A full-stack bus transportation platform serving 5,000+ students and faculty with real-time commute tracking, role-based portals, and automated notifications.',
  'A university with 5,000+ students and faculty needed a reliable way to track daily bus commutes, manage timetables, and give students, drivers, and admins their own role-based views.',
  'Built three role-based portals (Student, Driver, Admin) with protected routing, JWT authentication, RBAC, and HTTP-only cookies. Designed a scalable backend with MVC architecture, Mongoose, and database indexing delivering RESTful APIs with sub-100ms response times under concurrent load. Automated email notifications via Nodemailer and bulk timetable imports using ExcelJS.',
  'Deployed a high-availability platform on Vercel serving 5,000+ users, reducing unauthorized access to zero and saving 5+ hours/week of manual admin work through automation.',
  'KIITGO is a full-stack bus transportation platform built with the MERN stack that serves 5,000+ students and faculty. It features three role-based portals (Student, Driver, Admin) with protected routing, JWT authentication, RBAC, and HTTP-only cookies. The backend uses MVC architecture, Mongoose, and database indexing for sub-100ms API response times under concurrent load. Automated email notifications run via Nodemailer, and bulk timetable imports use ExcelJS, saving 5+ hours/week of manual admin work. Deployed on Vercel with connection pooling and indexed queries.',
  'Web Application',
  ARRAY['React.js','Node.js','Express.js','MongoDB','JWT','RBAC','Nodemailer','ExcelJS','Vercel'],
  'https://kiit-go-transport-system.vercel.app',
  NULL,
  'https://images.pexels.com/photos/12893083/pexels-photo-12893083.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '2025-10-01',
  'PUBLISHED',
  true,
  2,
  'KIITGO — Smart Bus Service Management System | Our Team',
  'KIITGO is a full-stack MERN bus transportation platform serving 5,000+ users with role-based portals, real-time tracking, and automated notifications.'
)
ON CONFLICT (slug) DO NOTHING;

-- SecureDrive project (Bikash)
INSERT INTO projects (slug, title, short_summary, problem, solution, outcome, body, category, technologies, demo_url, source_code_url, cover_image_url, completion_date, status, featured, display_order, seo_title, seo_description)
VALUES (
  'securedrive',
  'SecureDrive — Browser-Native Secure Cloud Storage Framework',
  'A secure cloud storage prototype with client-side encryption, protected metadata, deduplication-aware storage, and audit logging, validated with ProVerif.',
  'Cloud storage users need strong guarantees that their files are encrypted, metadata is protected, and sharing is controlled — without trusting the server with plaintext.',
  'Developed a secure cloud storage prototype using client-side encryption (WebCrypto API, AES-GCM, PBKDF2, SHA-256), protected metadata, deduplication-aware storage, password-protected sharing, controlled retrieval, and audit logging. Validated upload/download/sharing protocols using ProVerif.',
  'Validated SecureDrive against a NoEncryption baseline across 1MB to 500MB file sizes; journal manuscript currently in progress.',
  'SecureDrive is a browser-native secure cloud storage framework built with React.js, TypeScript, Node.js, Express.js, and MongoDB. It uses the WebCrypto API for client-side encryption (AES-GCM, PBKDF2, SHA-256), protects metadata, supports deduplication-aware storage, password-protected sharing, controlled retrieval, and audit logging. The upload/download/sharing protocols were formally validated using ProVerif, and the system was evaluated against a NoEncryption baseline across 1MB to 500MB file sizes. A journal manuscript is currently in progress.',
  'Security & Research',
  ARRAY['React.js','TypeScript','Node.js','Express.js','MongoDB','WebCrypto API','AES-GCM','PBKDF2','SHA-256','JWT','ProVerif'],
  NULL,
  NULL,
  'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '2025-06-01',
  'PUBLISHED',
  true,
  3,
  'SecureDrive — Browser-Native Secure Cloud Storage | Our Team',
  'SecureDrive is a browser-native secure cloud storage prototype with client-side encryption, deduplication-aware storage, and ProVerif-validated protocols.'
)
ON CONFLICT (slug) DO NOTHING;

-- AI-Driven Dynamic Access Control for IAM in Zero Trust (Bikash)
INSERT INTO projects (slug, title, short_summary, problem, solution, outcome, body, category, technologies, demo_url, source_code_url, cover_image_url, completion_date, status, featured, display_order, seo_title, seo_description)
VALUES (
  'zerotrust-iam',
  'AI-Driven Dynamic Access Control for IAM in Zero Trust Architecture',
  'A Zero Trust IAM prototype that analyzes user, device, network, geolocation, and behaviour signals to classify access as Allow, Step-Up MFA, or Deny in real time.',
  'Static access policies cannot adapt to anomalous behaviour. A Zero Trust system needs to continuously evaluate signals and step up authentication when risk is detected.',
  'Built a Zero Trust IAM prototype that analyzes user, device, network, geolocation, keystroke, and session behaviour signals to classify access as Allow, Step-Up MFA, or Deny. Generated a 50,000-row synthetic IAM dataset with 26 attributes and 1,400 users. Used Isolation Forest and Variational Autoencoder models exported to ONNX for low-latency inference.',
  'Achieved 0.91 F1-score, 97% simulated attack blocking, 92% false-positive reduction, and 48 ms average decision latency.',
  'A Zero Trust IAM prototype that analyzes user, device, network, geolocation, keystroke, and session behaviour signals to classify access as Allow, Step-Up MFA, or Deny. A 50,000-row synthetic IAM dataset with 26 attributes and 1,400 users was generated for training. Models include Isolation Forest and a Variational Autoencoder, exported to ONNX for low-latency inference via REST API and gRPC. Integrated with Azure AD Conditional Access. Achieved 0.91 F1-score, 97% simulated attack blocking, 92% false-positive reduction, and 48 ms average decision latency.',
  'Security & Research',
  ARRAY['Python','TensorFlow','Scikit-learn','Isolation Forest','Variational Autoencoder','ONNX','Docker','REST API','gRPC','Azure AD'],
  NULL,
  NULL,
  'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '2025-06-01',
  'PUBLISHED',
  false,
  4,
  'AI-Driven Dynamic Access Control for Zero Trust IAM | Our Team',
  'A Zero Trust IAM prototype using AI to classify access as Allow, Step-Up MFA, or Deny with 0.91 F1-score and 97% attack blocking.'
)
ON CONFLICT (slug) DO NOTHING;

-- Content Sphere Hub CMS (Bikash)
INSERT INTO projects (slug, title, short_summary, problem, solution, outcome, body, category, technologies, demo_url, source_code_url, cover_image_url, completion_date, status, featured, display_order, seo_title, seo_description)
VALUES (
  'content-sphere-hub',
  'Content Sphere Hub — Full-Stack CMS',
  'A full-stack content management system with reusable UI components, protected auth routes, blog workflows, dark mode, and backend error-handling middleware.',
  'Content creators needed a flexible CMS with blog creation/editing workflows, a responsive dashboard, dark mode, and robust backend error handling.',
  'Built a full-stack CMS using React.js, Node.js, Express.js, MongoDB, JWT, and REST APIs during an 8-week industrial internship. Implemented reusable UI components, protected authentication routes, blog creation/editing workflows, a responsive dashboard, dark mode, and backend error-handling middleware.',
  'Delivered a complete, responsive CMS with secure auth and a clean editorial workflow.',
  'Content Sphere Hub is a full-stack CMS built during an 8-week project-based industrial internship at the Academy of Skill Development. It uses React.js, Node.js, Express.js, MongoDB, JWT, and REST APIs. Features include reusable UI components, protected authentication routes, blog creation/editing workflows, a responsive dashboard, dark mode, and backend error-handling middleware. Certificate ID: ASD/FUL/KAL/CMS/75298.',
  'Web Application',
  ARRAY['React.js','Node.js','Express.js','MongoDB','JWT','REST APIs'],
  NULL,
  NULL,
  'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '2025-07-01',
  'PUBLISHED',
  false,
  5,
  'Content Sphere Hub — Full-Stack CMS | Our Team',
  'A full-stack MERN CMS with reusable components, protected auth routes, blog workflows, dark mode, and robust error handling.'
)
ON CONFLICT (slug) DO NOTHING;

-- Link members to projects
INSERT INTO project_members (project_id, member_id, role_on_project, contribution, display_order)
SELECT p.id, m.id, 'Full Stack Developer', 'Built the entire MERN application end-to-end including frontend, backend, authentication, and deployment.', 1
FROM projects p, members m
WHERE p.slug = 'taskflow' AND m.slug = 'sandip-kumar-sah'
ON CONFLICT (project_id, member_id) DO NOTHING;

INSERT INTO project_members (project_id, member_id, role_on_project, contribution, display_order)
SELECT p.id, m.id, 'Full Stack Developer', 'Designed and built the full platform including 3 role-based portals, backend architecture, authentication, and automation.', 1
FROM projects p, members m
WHERE p.slug = 'kiitgo' AND m.slug = 'sandip-kumar-sah'
ON CONFLICT (project_id, member_id) DO NOTHING;

INSERT INTO project_members (project_id, member_id, role_on_project, contribution, display_order)
SELECT p.id, m.id, 'Security Engineer & Developer', 'Designed and implemented client-side encryption, protected metadata, deduplication-aware storage, and ProVerif protocol validation.', 1
FROM projects p, members m
WHERE p.slug = 'securedrive' AND m.slug = 'bikash-kushwaha'
ON CONFLICT (project_id, member_id) DO NOTHING;

INSERT INTO project_members (project_id, member_id, role_on_project, contribution, display_order)
SELECT p.id, m.id, 'ML & Security Engineer', 'Built the AI models, synthetic dataset, ONNX inference pipeline, and Azure AD Conditional Access integration.', 1
FROM projects p, members m
WHERE p.slug = 'zerotrust-iam' AND m.slug = 'bikash-kushwaha'
ON CONFLICT (project_id, member_id) DO NOTHING;

INSERT INTO project_members (project_id, member_id, role_on_project, contribution, display_order)
SELECT p.id, m.id, 'Full Stack Developer', 'Built the full-stack CMS with reusable components, auth, blog workflows, and error-handling middleware.', 1
FROM projects p, members m
WHERE p.slug = 'content-sphere-hub' AND m.slug = 'bikash-kushwaha'
ON CONFLICT (project_id, member_id) DO NOTHING;
