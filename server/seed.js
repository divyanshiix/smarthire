const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');
const Applicant = require('./models/Applicant');

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing seed data...');
    await User.deleteMany();
    await Job.deleteMany();
    await Applicant.deleteMany();

    console.log('👤 Creating default recruiter account...');
    const recruiter = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@smarthire.com',
      password: 'password123',
      role: 'recruiter',
      company: 'SmartHire Tech Corp',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    });

    console.log('💼 Creating job postings...');
    const jobs = await Job.create([
      {
        title: 'Senior Full-Stack MERN Developer',
        department: 'Engineering',
        location: 'San Francisco, CA (Hybrid)',
        type: 'full-time',
        status: 'active',
        description: 'We are seeking an experienced Full-Stack MERN Developer to build scalable cloud features, optimize API endpoints, and lead web engineering initiatives.',
        requirements: ['5+ years Node.js & Express', 'React & TypeScript proficiency', 'MongoDB schema optimization', 'REST & GraphQL APIs'],
        salaryRange: '$135,000 - $165,000',
        recruiterId: recruiter._id
      },
      {
        title: 'Frontend React Engineer',
        department: 'Engineering',
        location: 'Remote',
        type: 'full-time',
        status: 'active',
        description: 'Join our dynamic product team creating responsive, high-performance web applications using modern React, Tailwind CSS, and Web Vitals best practices.',
        requirements: ['3+ years React.js', 'CSS Grid & modern animations', 'State management (Redux/Zustand)', 'Jest / React Testing Library'],
        salaryRange: '$110,000 - $135,000',
        recruiterId: recruiter._id
      },
      {
        title: 'UX/UI Product Designer',
        department: 'Design',
        location: 'New York, NY',
        type: 'full-time',
        status: 'active',
        description: 'Design intuitive, visual, user-centric interfaces for our HR Tech platform. Collaborate directly with engineering and product managers.',
        requirements: ['Figma mastery', 'Design Systems expertise', 'User research & prototyping', 'Accessibility (WCAG 2.1)'],
        salaryRange: '$105,000 - $130,000',
        recruiterId: recruiter._id
      },
      {
        title: 'DevOps & Cloud Engineer',
        department: 'Infrastructure',
        location: 'Austin, TX (Remote)',
        type: 'contract',
        status: 'active',
        description: 'Manage CI/CD pipelines, Docker containerization, Kubernetes clusters, and AWS/Render cloud deployments.',
        requirements: ['AWS & Docker', 'Terraform / IaC', 'GitHub Actions CI/CD', 'Monitoring (Datadog/Prometheus)'],
        salaryRange: '$70 - $90 / hr',
        recruiterId: recruiter._id
      },
      {
        title: 'HR Talent Acquisition Specialist',
        department: 'Human Resources',
        location: 'Chicago, IL',
        type: 'full-time',
        status: 'closed',
        description: 'Lead technical recruitment pipelines, conduct initial candidate screening, and coordinate interview loops across engineering departments.',
        requirements: ['3+ years HR Recruiting', 'ATS software proficiency', 'Candidate sourcing', 'Offer negotiations'],
        salaryRange: '$85,000 - $105,000',
        recruiterId: recruiter._id
      }
    ]);

    console.log('📄 Adding candidate applications...');
    await Applicant.create([
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 234-5678',
        jobId: jobs[0]._id,
        status: 'interview',
        notes: 'Exceptional system design knowledge. High problem-solving capability in backend microservices.',
        rating: 5
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@example.com',
        phone: '+1 (555) 345-6789',
        jobId: jobs[0]._id,
        status: 'screening',
        notes: 'Solid MERN experience. Resume looks strong with 4 years of Node.js production code.',
        rating: 4
      },
      {
        name: 'Marcus Vance',
        email: 'marcus.vance@example.com',
        phone: '+1 (555) 456-7890',
        jobId: jobs[1]._id,
        status: 'offered',
        notes: 'Outstanding UI portfolio and React performance optimization work. Offer letter sent.',
        rating: 5
      },
      {
        name: 'Sophia Patel',
        email: 'sophia.patel@example.com',
        phone: '+1 (555) 567-8901',
        jobId: jobs[1]._id,
        status: 'applied',
        notes: 'Recent CS graduate with strong React & TypeScript open-source contributions.',
        rating: 3
      },
      {
        name: 'Daniel Kim',
        email: 'daniel.kim@example.com',
        phone: '+1 (555) 678-9012',
        jobId: jobs[2]._id,
        status: 'hired',
        notes: 'Hired! Great Figma design system portfolio and user interview experience.',
        rating: 5
      },
      {
        name: 'Chloe Bennett',
        email: 'chloe.bennett@example.com',
        phone: '+1 (555) 789-0123',
        jobId: jobs[3]._id,
        status: 'applied',
        notes: 'Strong AWS & Kubernetes background.',
        rating: 4
      },
      {
        name: 'Jordan Miller',
        email: 'jordan.miller@example.com',
        phone: '+1 (555) 890-1234',
        jobId: jobs[0]._id,
        status: 'rejected',
        notes: 'Looking for a more junior role. Did not meet minimum 5-year experience requirement.',
        rating: 2
      }
    ]);

    console.log('🎉 Seed completed successfully!');
    console.log('\n----------------------------------------');
    console.log('🔑 Default Recruiter Credentials:');
    console.log('   Email:    recruiter@smarthire.com');
    console.log('   Password: password123');
    console.log('----------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
