require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize, User, StudentProfile, MentorProfile, Skill, StudentSkill,
  Project, ProjectSkill, Application, Internship, Milestone, Task,
  Submission, Feedback, Notification,
} = require('../models');

const DEMO_PASSWORD = 'Demo@1234';

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('Tables recreated. Seeding demo data...');

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    // --- Users ---
    const admin = await User.create({ name: 'Admin User', email: 'admin@internconnect.com', passwordHash, role: 'admin' });

    const mentor1 = await User.create({ name: 'Mentor One', email: 'mentor@internconnect.com', passwordHash, role: 'mentor' });
    const mentor2 = await User.create({ name: 'Priya Sharma', email: 'priya.mentor@internconnect.com', passwordHash, role: 'mentor' });
    await MentorProfile.create({ userId: mentor1.id, specialization: 'Full Stack Web Development', experience: '6 years', department: 'Engineering', bio: 'Leads the frontend guild and mentors new interns on React and design systems.' });
    await MentorProfile.create({ userId: mentor2.id, specialization: 'Backend & Databases', experience: '8 years', department: 'Engineering', bio: 'Focuses on API design, databases and deployment practices.' });

    const student1 = await User.create({ name: 'Student One', email: 'student@internconnect.com', passwordHash, role: 'student' });
    const student2 = await User.create({ name: 'Aisha Khan', email: 'aisha.student@internconnect.com', passwordHash, role: 'student' });
    const student3 = await User.create({ name: 'Rohan Verma', email: 'rohan.student@internconnect.com', passwordHash, role: 'student' });

    await StudentProfile.create({ userId: student1.id, college: 'NCR Institute of Technology', degree: 'B.Tech', branch: 'Computer Science', semester: '5', github: 'https://github.com/student-one', linkedin: 'https://linkedin.com/in/student-one', resumeUrl: 'https://example.com/resume1.pdf', bio: 'Aspiring full-stack developer interested in data-driven products.' });
    await StudentProfile.create({ userId: student2.id, college: 'Delhi College of Engineering', degree: 'B.Tech', branch: 'Information Technology', semester: '6' });
    await StudentProfile.create({ userId: student3.id, college: 'Noida Institute', degree: 'BCA', branch: 'Computer Applications', semester: '4' });

    // --- Skills ---
    const skillNames = [
      ['React', 'Frontend'], ['JavaScript', 'Frontend'], ['Node.js', 'Backend'],
      ['Python', 'Backend'], ['SQL', 'Database'], ['MongoDB', 'Database'],
      ['Machine Learning', 'AI/ML'], ['CSS', 'Frontend'], ['Express', 'Backend'], ['Git', 'Tools'],
    ];
    const skills = {};
    for (const [name, category] of skillNames) {
      skills[name] = await Skill.create({ name, category });
    }

    await StudentSkill.bulkCreate([
      { studentId: student1.id, skillId: skills['React'].id, proficiency: 'intermediate', verified: true },
      { studentId: student1.id, skillId: skills['JavaScript'].id, proficiency: 'advanced', verified: true },
      { studentId: student1.id, skillId: skills['CSS'].id, proficiency: 'intermediate', verified: false },
      { studentId: student2.id, skillId: skills['Python'].id, proficiency: 'beginner', verified: false },
    ]);

    // --- Projects ---
    const projectsData = [
      {
        title: 'E-Commerce Storefront with React',
        description: 'Build a responsive storefront with product listings, cart, and checkout flow using React and a REST backend.',
        objectives: 'Learn component architecture, state management, and API integration.',
        requirements: 'Basic HTML/CSS/JS knowledge.',
        category: 'Frontend', difficulty: 'beginner', duration: '6 weeks', seats: 3,
        applicationDeadline: daysFromNow(21), startDate: daysFromNow(28), endDate: daysFromNow(70),
        status: 'open', mentorId: mentor1.id, skills: ['React', 'JavaScript', 'CSS'],
      },
      {
        title: 'REST API for Task Management',
        description: 'Design and implement a task management REST API with authentication and role-based access.',
        objectives: 'Practice API design, database modelling, and JWT authentication.',
        requirements: 'Familiarity with Node.js.',
        category: 'Backend', difficulty: 'intermediate', duration: '8 weeks', seats: 2,
        applicationDeadline: daysFromNow(14), startDate: daysFromNow(21), endDate: daysFromNow(77),
        status: 'open', mentorId: mentor2.id, skills: ['Node.js', 'Express', 'SQL'],
      },
      {
        title: 'Full Stack Internship Portal',
        description: 'Contribute to a full-stack portal connecting students with mentors, similar to InternConnect itself.',
        objectives: 'End-to-end feature ownership across frontend, backend and database.',
        requirements: 'Comfortable with JavaScript across the stack.',
        category: 'Full Stack', difficulty: 'advanced', duration: '10 weeks', seats: 2,
        applicationDeadline: daysFromNow(10), startDate: daysFromNow(-5), endDate: daysFromNow(65),
        status: 'open', mentorId: mentor1.id, skills: ['React', 'Node.js', 'SQL', 'Git'],
      },
      {
        title: 'ML-Powered Resume Screener',
        description: 'Build a machine learning pipeline that scores resumes against a job description.',
        objectives: 'Text preprocessing, feature extraction, and model evaluation.',
        requirements: 'Basic Python and statistics.',
        category: 'AI/ML', difficulty: 'advanced', duration: '8 weeks', seats: 2,
        applicationDeadline: daysFromNow(30), startDate: daysFromNow(37), endDate: daysFromNow(93),
        status: 'open', mentorId: mentor2.id, skills: ['Python', 'Machine Learning'],
      },
      {
        title: 'Database Design for a Booking System',
        description: 'Design a normalized schema and query layer for a multi-tenant booking system.',
        objectives: 'Schema normalization, indexing strategy, and query optimization.',
        requirements: 'SQL basics.',
        category: 'Database', difficulty: 'intermediate', duration: '5 weeks', seats: 3,
        applicationDeadline: daysFromNow(18), startDate: daysFromNow(25), endDate: daysFromNow(60),
        status: 'open', mentorId: mentor2.id, skills: ['SQL', 'MongoDB'],
      },
    ];

    const projects = [];
    for (const p of projectsData) {
      const { skills: skillList, ...projectFields } = p;
      const project = await Project.create(projectFields);
      for (const sName of skillList) {
        await ProjectSkill.create({ projectId: project.id, skillId: skills[sName].id });
      }
      projects.push(project);
    }

    // --- Applications ---
    const app1 = await Application.create({
      studentId: student1.id, projectId: projects[2].id, // Full Stack Internship Portal
      fullName: student1.name, email: student1.email, phone: '9876543210',
      college: 'NCR Institute of Technology', degree: 'B.Tech', branch: 'Computer Science', semester: '5',
      skillsText: 'React, JavaScript, CSS, Git', resumeUrl: 'https://example.com/resume1.pdf',
      github: 'https://github.com/student-one', linkedin: 'https://linkedin.com/in/student-one',
      motivation: 'I want hands-on experience building a real full-stack product end to end.',
      previousProjects: 'Built a personal portfolio site and a to-do app with local storage.',
      status: 'accepted', appliedAt: daysFromNow(-10), reviewedAt: daysFromNow(-8),
    });

    await Application.create({
      studentId: student2.id, projectId: projects[0].id,
      fullName: student2.name, email: student2.email, phone: '9876500000',
      college: 'Delhi College of Engineering', degree: 'B.Tech', branch: 'Information Technology', semester: '6',
      skillsText: 'Python, basic JS', motivation: 'Keen to build strong frontend fundamentals.',
      status: 'pending', appliedAt: daysFromNow(-2),
    });

    await Application.create({
      studentId: student3.id, projectId: projects[3].id,
      fullName: student3.name, email: student3.email,
      college: 'Noida Institute', degree: 'BCA', branch: 'Computer Applications', semester: '4',
      motivation: 'Interested in applying ML to real-world screening problems.',
      status: 'under_review', appliedAt: daysFromNow(-4),
    });

    // --- Internship (from the accepted application) ---
    const internship = await Internship.create({
      studentId: student1.id, mentorId: mentor1.id, projectId: projects[2].id, applicationId: app1.id,
      startDate: daysFromNow(-8), endDate: daysFromNow(62), status: 'active', overallProgress: 0,
    });

    const roadmap = [
      { title: 'Web Foundations', description: 'Semantic HTML, accessibility, forms, links, media and page structure.', status: 'completed', progress: 100 },
      { title: 'Interface Design', description: 'CSS layouts, responsive design, typography, spacing and reusable components.', status: 'in_progress', progress: 50 },
      { title: 'Interactivity', description: 'JavaScript events, DOM manipulation, validation, arrays and application logic.', status: 'not_started', progress: 0 },
      { title: 'Quality & Delivery', description: 'Testing, performance, Git workflow, deployment and documentation.', status: 'not_started', progress: 0 },
    ];

    let firstTaskForSubmission = null;
    for (const [idx, stage] of roadmap.entries()) {
      const milestone = await Milestone.create({
        internshipId: internship.id, title: stage.title, description: stage.description,
        status: stage.status, progress: stage.progress,
        startDate: daysFromNow(-8 + idx * 14), deadline: daysFromNow(6 + idx * 14),
      });

      const taskStatuses = stage.status === 'completed'
        ? ['completed', 'completed']
        : stage.status === 'in_progress'
          ? ['completed', 'submitted']
          : ['pending', 'pending'];

      const tasks = await Task.bulkCreate([
        { milestoneId: milestone.id, title: `${stage.title} — Task 1`, description: 'First deliverable for this milestone.', status: taskStatuses[0], dueDate: daysFromNow(3 + idx * 14) },
        { milestoneId: milestone.id, title: `${stage.title} — Task 2`, description: 'Second deliverable for this milestone.', status: taskStatuses[1], dueDate: daysFromNow(6 + idx * 14) },
      ], { returning: true });

      if (stage.status === 'in_progress' && !firstTaskForSubmission) {
        firstTaskForSubmission = tasks[1];
      }
    }

    const allMilestoneProgress = roadmap.map((s) => s.progress);
    const avgProgress = Math.round(allMilestoneProgress.reduce((a, b) => a + b, 0) / allMilestoneProgress.length);
    await internship.update({ overallProgress: avgProgress });

    if (firstTaskForSubmission) {
      const submission = await Submission.create({
        taskId: firstTaskForSubmission.id, studentId: student1.id,
        content: 'Implemented the responsive layout using CSS Grid and Flexbox, added a reusable Card component.',
        githubUrl: 'https://github.com/student-one/internconnect-frontend',
        status: 'submitted', submittedAt: daysFromNow(-1),
      });
      await Feedback.create({ submissionId: submission.id, mentorId: mentor1.id, comment: 'Nice structure — check spacing on mobile before resubmitting.', score: null });
    }

    // --- Notifications ---
    await Notification.bulkCreate([
      { userId: student1.id, title: 'Application accepted!', message: `You've been accepted into "${projects[2].title}". Your internship has started.`, type: 'application', isRead: true },
      { userId: student1.id, title: 'Milestone completed', message: 'You completed the "Web Foundations" milestone.', type: 'milestone', isRead: false },
      { userId: mentor1.id, title: 'New submission to review', message: 'Student One submitted work for review.', type: 'submission', isRead: false },
      { userId: student2.id, title: 'Application received', message: `Your application to "${projects[0].title}" is pending review.`, type: 'application', isRead: false },
      { userId: admin.id, title: 'Platform update', message: 'Weekly analytics report is ready.', type: 'general', isRead: true },
    ]);

    console.log('\nSeed complete.\n');
    console.log('Demo accounts (password for all: ' + DEMO_PASSWORD + '):');
    console.log('  Admin   -> admin@internconnect.com');
    console.log('  Mentor  -> mentor@internconnect.com');
    console.log('  Student -> student@internconnect.com');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

seed();
