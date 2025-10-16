-- 001_create_tables.sql
-- Migration: create initial tables for portfolio site (placed under supabase-functions as requested)

-- Enable uuid generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles: main site owner profile
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  title text,
  headline text,
  bio text,
  avatar_url text,
  profile_image_url text,
  resume_url text,
  contact jsonb,
  social_links jsonb,
  strengths text[],
  industry_experience text[],
  stats jsonb,
  settings jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE,
  description text,
  technologies text[],
  images jsonb,
  live_demo text,
  source_code text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Work experience (resume)
CREATE TABLE IF NOT EXISTS work_experience (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  company text,
  location text,
  role text,
  duration text,
  responsibilities jsonb,
  projects jsonb,
  ord integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Education
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  degree text,
  institution text,
  year text,
  ord integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Contact messages (from contact form)
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text,
  email text,
  subject text,
  message text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User settings (persist settings like theme per-profile)
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  key text NOT NULL,
  value jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Optional conversations/messages for chat history
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender text,
  text text,
  model_version text,
  created_at timestamptz DEFAULT now()
);

-- Seed initial profile and projects using data from src/assets/data/profile.json
-- NOTE: adjust URLs after you upload assets to Supabase Storage

INSERT INTO profiles (id, name, title, headline, bio, profile_image_url, resume_url, contact, social_links, strengths, industry_experience, stats)
VALUES (
  -- use a fixed UUID so related seed rows can reference it
  '11111111-1111-1111-1111-111111111111',
  'Rohit Nair',
  'Frontend Developer',
  'A Passionate Web Developer Specialized in Angular & Node.js',
  'Frontend Developer with 4.5 years of experience building user interfaces for web applications in the Finance and Wealth Management sector. Proficient in Angular, TypeScript, HTML, CSS, and various UI component libraries. Proven ability to collaborate effectively in team environments and deliver high-quality solutions. Seeking to contribute technical expertise in an environment of growth and excellence to achieve both personal and organizational goals.',
  'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.0.3',
  'public/resumes/Rohit.Nair.pdf',
  '{"email": "rohit296nair@yahoo.com", "phone": "+91-8668671077 / 9921313026", "address": "Hinjewadi, Pune, Maharashtra, India"}',
  '{"github": "https://github.com/rohitnair321", "linkedin": "https://linkedin.com/in/rohitnair321"}',
  '{"UI/UX Design", "State Management", "Performance Optimization", "Cross-Browser Dev", "Technical Documentation", "Team Collaboration", "Problem Solving"}',
  '{"Finance","Wealth Management","Fintech","Banking Solutions"}',
  '{"projects": 12, "posts": 34, "followers": 287, "following": 142}'
);

-- Insert projects based on the sample data
INSERT INTO projects (profile_id, title, slug, description, technologies, featured)
VALUES
('11111111-1111-1111-1111-111111111111', 'PFM (Personal Finance Management)', 'pfm-personal-finance-management', 'A comprehensive personal finance management product application for Fiserv, Inc. Re-developed PFM in new technology: Angular v17 (Frontend), Java (Backend). The entire application was built with custom classes and components, no component library or Bootstrap used. Created custom UI architecture so the product can be used by multiple financial institutes. Designed architecture for SSO using NGRX for state management to optimize performance. Implemented ADA (Americans with Disabilities Act) compliance for accessibility. Status: Live.', ARRAY['Angular 17','Java','NGRX','Custom CSS'], true),
('11111111-1111-1111-1111-111111111111', 'HBNO-Wealthermapper (Neples)', 'hbno-wealthermapper-neples', 'Developed a secure investment web application for managing investments in funds and stocks for Handelsbanken. Built using Angular 14 and .NET Core. Utilized Bootstrap classes and Primeng component library for responsive design. Status: Live.', ARRAY['Angular 14','.NET Core','Bootstrap','Primeng'], true),
('11111111-1111-1111-1111-111111111111', 'Suitability Test Web Application', 'suitability-test-web-application', 'Created a web-based suitability test for Handelsbanken to assess customer knowledge before investment. This survey/assessment helps suggest suitable funds for investment. Used Bootstrap classes and Primeng component library for responsive design. Status: Live.', ARRAY['Angular','Bootstrap','Primeng'], true),
('11111111-1111-1111-1111-111111111111', 'I1Wealth (Product)', 'i1wealth-product', 'Contributed to the development of a modular Wealth Management platform. The application combines wealth management and insurance management. Built using Angular 8, ABP framework, Bootstrap classes, and Primeng component library for responsive design.', ARRAY['Angular 8','ABP Framework','Bootstrap','Primeng'], true);

-- Example: seed work_experience rows
INSERT INTO work_experience (profile_id, company, location, role, duration, responsibilities, projects, ord)
VALUES
('11111111-1111-1111-1111-111111111111', 'Infosys Limited', 'Pune, India', 'Technology Analyst (Angular Frontend Developer)', 'August 2024 - Present', 
  '["Developed web applications using Angular v17 with a focus on modern architecture patterns","Implemented NGRX state management to optimize application performance and reusability","Created responsive UIs with custom CSS and Flexbox layouts","Engineered dynamic components for use across multiple application flows"]'::jsonb,
  '[{"title":"PFM (Personal Finance Management)","client":"Fiserv","responsibilities":["Migrated PFM product to modern technology stack (Angular, Java Spring boot)","Designed architecture for Single Sign-On (SSO) using NGRX state management","Created custom UI architecture enabling adoption by multiple financial institutions","Implemented ADA compliance for accessibility standards"]}]'::jsonb, 1),
('11111111-1111-1111-1111-111111111111', 'Ikione Systems Pvt Ltd', 'Pune, India', 'Frontend Developer', 'January 2021 – July 2024',
  '["Developed user interfaces for wealth management applications using Angular, Bootstrap, HTML, CSS","Created interactive financial charts with Highcharts for market data visualization","Integrated third-party APIs for customer verification and real-time market data","Implemented Identity Provider (IdP) configuration for secure FINODS environment access"]'::jsonb,
  '[{"title":"HBNO-Welathermapper (Handelsbanken)","responsibilities":["Developed secure investment web application for managing funds and stocks (Angular 14)","Implemented real-time portfolio tracking and financial analytics"]},{"title":"Suitability Test Web Application (Handelsbanken)","responsibilities":["Created web-based suitability assessment for investor knowledge evaluation (Angular 10)","Designed dynamic questionnaire engine with scoring system"]},{"title":"I1Wealth (Product)","responsibilities":["Contributed to development of modular Wealth Management platform (Angular 8)","Integrated multiple financial data sources into unified dashboard"]}]'::jsonb, 2);

-- Example: seed education
INSERT INTO education (profile_id, degree, institution, year, ord)
VALUES
('11111111-1111-1111-1111-111111111111', 'Master of Computer Applications (MCA)', 'IMCC, Pune (SPPU)', '2021', 1),
('11111111-1111-1111-1111-111111111111', 'Bachelor of Computer Applications (BCA)', 'MMCC, Pune (SPPU)', '2017', 2),
('11111111-1111-1111-1111-111111111111', 'Higher Secondary Certificate (HSC)', 'Sinhgad Public School, Lonavala (CBSE)', '2014', 3),
('11111111-1111-1111-1111-111111111111', 'Secondary School Certificate (SSC)', 'Kendriya Vidyalaya, Lonavala (CBSE)', '2012', 4);

-- End of migration
