/* =====================================
   HODEE INTERIOR DATABASE SCHEMA
===================================== */

/* ADMIN TABLE */

CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* SERVICES TABLE */

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO services (name) VALUES
('Interior Design'),
('House Blueprint'),
('Architecture'),
('Consultation');

/* ENQUIRIES TABLE */

CREATE TABLE enquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* PROJECTS TABLE */

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* INDEXES */

CREATE INDEX idx_enquiries_service ON enquiries(service);
CREATE INDEX idx_enquiries_date ON enquiries(created_at);
CREATE INDEX idx_projects_status ON projects(status);

/* DEFAULT ADMIN */

INSERT INTO admins (name,email,password)
VALUES (
  'Admin',
  'enquiry@hodeeinterior.com',
  'hodee#2026%10=6'
);