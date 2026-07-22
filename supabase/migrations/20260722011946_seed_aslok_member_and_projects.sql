/*
# Add Aslok Singh Rajput as third team member and his projects

1. New member: Aslok Singh Rajput
   - Full Stack / ML Developer
   - KIIT University, CSE, CGPA 8.49/10
   - Skills: Python, Java, JavaScript, SQL, C, React, Node.js, Express, Flask, Spring Boot, Angular, Scikit-learn, NLTK, AWS, Azure, Power BI, Tableau

2. New projects (Aslok's):
   - WingX – Food Delivery Application (MERN + Socket.io + Razorpay) — PUBLISHED
   - Heart Disease Prediction (Flask + ML) — PUBLISHED
   - Twitter Sentiment Analysis (Python, NLP) — PUBLISHED

3. project_members rows linking Aslok to his projects.
*/

-- Insert Aslok Singh Rajput
INSERT INTO members (
  slug, full_name, title, bio, experience_summary, location, email, phone,
  linkedin_url, github_url, portfolio_url, avatar_url,
  skills, certifications, achievements, availability_status, display_order
) VALUES (
  'aslok-singh-rajput',
  'Aslok Singh Rajput',
  'Full Stack Developer & ML Engineer',
  'Full Stack Developer and Machine Learning Engineer pursuing B.Tech in CSE at KIIT University (CGPA 8.49/10). Experienced in building MERN applications with real-time features, payment integrations, and ML web applications for predictive analytics. Passionate about AI/ML, data science, and delivering production-grade software.',
  'B.Tech CSE at KIIT University (CGPA 8.49/10). Built WingX, a full-stack MERN food delivery platform with Razorpay payment gateway and real-time Socket.io updates; developed ML pipelines for health prediction and sentiment analysis.',
  'Nepal / Bhubaneswar, India',
  'aslok.rajput143@gmail.com',
  '+977-9816210951',
  NULL,
  NULL,
  NULL,
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Python','Java','JavaScript','SQL','C','HTML','CSS','React.js','Node.js','Express.js','Flask','Spring Boot','Angular','Scikit-learn','NLTK','Pandas','NumPy','AWS (EC2, S3)','Azure Data Factory','Socket.io','Razorpay','Git','Postman','Tableau','Power BI'],
  ARRAY['AWS Academy Graduate – AWS Academy Cloud Architecting','ExcelR: Data Engineering','ExcelR: Full Stack Development – Java Spring Boot & Angular','Eduskills: Python Full Stack Developer Virtual Internship','Palo Alto Networks: Certified Cybersecurity Practitioner'],
  ARRAY['Built WingX – a full-stack MERN food delivery platform with real-time updates and payment gateway integration','Developed ML web app for heart disease prediction with Flask backend and Scikit-learn pipeline','Implemented Twitter Sentiment Analysis with NLP, TF-IDF feature extraction, and classification algorithms','Speaker at Code Optimization & Performance workshop – Department of CS, KIIT (Aug 2025)'],
  'available',
  3
)
ON CONFLICT (slug) DO NOTHING;

-- WingX project
INSERT INTO projects (
  slug, title, short_summary, problem, solution, outcome, body, category,
  technologies, demo_url, source_code_url, cover_image_url,
  completion_date, status, featured, display_order, seo_title, seo_description
) VALUES (
  'wingx-food-delivery',
  'WingX – Full-Stack Food Delivery Application',
  'A MERN-stack food delivery platform with three user roles, Razorpay payment gateway, real-time Socket.io order tracking, and a nutrition scanner API.',
  'Food delivery platforms need to coordinate multiple parties — customers, restaurant owners, and delivery personnel — in real time, with secure payments and role-based access.',
  'Built a full-stack MERN platform with three role-based portals (User, Restaurant Owner, Delivery Boy) using JWT authentication and RBAC. Integrated Razorpay for secure payments, Socket.io for real-time order tracking and delivery notifications, LogMeal nutrition scanner API for dietary insights, and a broadcast notification system for delivery management.',
  'Delivered a production-grade food delivery platform with real-time order updates, secure payment processing, and role-specific dashboards for all three user types.',
  'WingX is a full-stack MERN food delivery application supporting three user roles: Customer, Restaurant Owner, and Delivery Boy. Built with React.js, Node.js, Express.js, and MongoDB. Features include JWT-based authentication, role-based access control, Razorpay payment gateway integration, Socket.io for real-time order status and delivery notifications, LogMeal nutrition scanner API for dietary insights, a diet plan module, and a broadcast notification system for delivery management.',
  'Web Application',
  ARRAY['React.js','Node.js','Express.js','MongoDB','Socket.io','Razorpay','JWT','RBAC'],
  NULL,
  NULL,
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '2026-03-01',
  'PUBLISHED',
  true,
  6,
  'WingX – Full-Stack Food Delivery App | MyClientWork',
  'WingX is a MERN-stack food delivery platform with three user roles, Razorpay payments, and real-time Socket.io order tracking.'
)
ON CONFLICT (slug) DO NOTHING;

-- Heart Disease Prediction
INSERT INTO projects (
  slug, title, short_summary, problem, solution, outcome, body, category,
  technologies, demo_url, source_code_url, cover_image_url,
  completion_date, status, featured, display_order, seo_title, seo_description
) VALUES (
  'heart-disease-prediction',
  'Heart Disease Prediction – ML Web Application',
  'A machine learning web application that predicts heart disease risk using patient health inputs, built with Python, Flask, Scikit-learn, and MySQL.',
  'Early detection of heart disease risk can save lives, but accessing clinical risk assessments is often slow and expensive. A patient-facing web tool can help with preventive healthcare.',
  'Designed and implemented a web application that takes user health inputs (age, blood pressure, cholesterol levels) and returns a risk prediction. Built a Flask backend, integrated Scikit-learn ML models, used MySQL for data persistence, and tested all APIs with Postman.',
  'Delivered an accurate risk assessment tool that enhances early detection and preventive healthcare through an accessible web interface backed by a validated ML pipeline.',
  'Heart Disease Prediction is a machine learning web application built with Python, Flask, Scikit-learn, Pandas, and MySQL. Users input health metrics (age, blood pressure, cholesterol, etc.) and receive a heart disease risk prediction from the ML model. The backend handles data persistence in MySQL, applies the trained Scikit-learn model for inference, and exposes REST APIs tested with Postman.',
  'Machine Learning',
  ARRAY['Python','Flask','Scikit-learn','Pandas','MySQL','Postman','REST API'],
  NULL,
  NULL,
  'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '2025-03-01',
  'PUBLISHED',
  false,
  7,
  'Heart Disease Prediction – ML Web App | MyClientWork',
  'A Flask + Scikit-learn ML web application that predicts heart disease risk using patient health inputs.'
)
ON CONFLICT (slug) DO NOTHING;

-- Twitter Sentiment Analysis
INSERT INTO projects (
  slug, title, short_summary, problem, solution, outcome, body, category,
  technologies, demo_url, source_code_url, cover_image_url,
  completion_date, status, featured, display_order, seo_title, seo_description
) VALUES (
  'twitter-sentiment-analysis',
  'Twitter Sentiment Analysis – NLP Classification Model',
  'An NLP model that classifies tweet sentiment using Python, NLTK, Scikit-learn, and TF-IDF feature extraction for social media trend analysis.',
  'Social media trend analysis requires efficiently classifying large volumes of tweet text by sentiment — positive, negative, or neutral — to support marketing, policy, and research decisions.',
  'Built a sentiment analysis pipeline using Python and NLTK for preprocessing (tokenization, stemming, lemmatization), TF-IDF feature extraction, and Scikit-learn classification algorithms. The model classifies tweets by sentiment to enable social media trend analysis.',
  'Achieved improved accuracy in sentiment classification through systematic preprocessing and TF-IDF feature engineering, delivering a reusable NLP pipeline for social media trend analysis.',
  'Twitter Sentiment Analysis is an NLP project built with Python, NLTK, Scikit-learn, and Pandas. The pipeline covers data preprocessing (tokenization, stemming, lemmatization), TF-IDF feature extraction, and training of classification algorithms to predict tweet sentiment. The goal is accurate social media trend analysis.',
  'Machine Learning',
  ARRAY['Python','NLP','NLTK','Scikit-learn','Pandas','TF-IDF'],
  NULL,
  NULL,
  'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '2025-07-01',
  'PUBLISHED',
  false,
  8,
  'Twitter Sentiment Analysis – NLP Model | MyClientWork',
  'An NLP classification model for tweet sentiment analysis using Python, NLTK, Scikit-learn, and TF-IDF feature extraction.'
)
ON CONFLICT (slug) DO NOTHING;

-- Link Aslok to his projects
INSERT INTO project_members (project_id, member_id, role_on_project, contribution, display_order)
SELECT p.id, m.id, 'Full Stack Developer', 'Built the complete MERN platform with role-based portals, Razorpay integration, real-time Socket.io updates, and nutrition scanner API.', 1
FROM projects p, members m
WHERE p.slug = 'wingx-food-delivery' AND m.slug = 'aslok-singh-rajput'
ON CONFLICT (project_id, member_id) DO NOTHING;

INSERT INTO project_members (project_id, member_id, role_on_project, contribution, display_order)
SELECT p.id, m.id, 'ML Engineer & Backend Developer', 'Designed the ML pipeline, Flask backend, Scikit-learn model integration, and MySQL data persistence for health risk prediction.', 1
FROM projects p, members m
WHERE p.slug = 'heart-disease-prediction' AND m.slug = 'aslok-singh-rajput'
ON CONFLICT (project_id, member_id) DO NOTHING;

INSERT INTO project_members (project_id, member_id, role_on_project, contribution, display_order)
SELECT p.id, m.id, 'NLP Engineer', 'Built the full NLP pipeline: preprocessing, TF-IDF feature extraction, and Scikit-learn classification for tweet sentiment analysis.', 1
FROM projects p, members m
WHERE p.slug = 'twitter-sentiment-analysis' AND m.slug = 'aslok-singh-rajput'
ON CONFLICT (project_id, member_id) DO NOTHING;
