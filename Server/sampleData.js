const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_PATH = path.join(__dirname, "database.sqlite");

// Connect to database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    return;
  }
  console.log("Connected to SQLite database for seeding fake data.");
});

// Hash password for all users (password: 'password')
const hashedPassword = bcrypt.hashSync("password", 10);

// 15 Regular Users
const users = [
  {
    name: "Emma Thompson",
    email: "emma.thompson@techcorp.com",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-05 08:30:00",
  },
  {
    name: "James Wilson",
    email: "james.wilson@devstudio.io",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-06 09:45:00",
  },
  {
    name: "Sophia Chen",
    email: "sophia.chen@innovate.dev",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-07 10:15:00",
  },
  {
    name: "Michael Rodriguez",
    email: "michael.rodriguez@webflow.com",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-08 11:20:00",
  },
  {
    name: "Olivia Parker",
    email: "olivia.parker@digitalhub.org",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-09 12:35:00",
  },
  {
    name: "William Kim",
    email: "william.kim@codebase.io",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-10 13:50:00",
  },
  {
    name: "Ava Johnson",
    email: "ava.johnson@techsolutions.com",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-11 14:05:00",
  },
  {
    name: "Benjamin Lee",
    email: "benjamin.lee@devteam.org",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-12 15:25:00",
  },
  {
    name: "Mia Garcia",
    email: "mia.garcia@softworks.dev",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-13 16:40:00",
  },
  {
    name: "Lucas Brown",
    email: "lucas.brown@nextgen.io",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-14 17:55:00",
  },
  {
    name: "Charlotte Davis",
    email: "charlotte.davis@cloudsystems.com",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-15 18:10:00",
  },
  {
    name: "Henry Martinez",
    email: "henry.martinez@dataflow.dev",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-16 19:25:00",
  },
  {
    name: "Amelia Taylor",
    email: "amelia.taylor@webcraft.io",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-17 20:40:00",
  },
  {
    name: "Alexander White",
    email: "alexander.white@innovate-labs.com",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-18 21:55:00",
  },
  {
    name: "Evelyn Anderson",
    email: "evelyn.anderson@techpioneers.org",
    password: hashedPassword,
    role: "user",
    created_at: "2024-01-19 22:15:00",
  },
];

// 25 Tasks with varied priorities and statuses
const tasks = [
  // High Priority Tasks (8)
  {
    title: "Critical Security Patch",
    description:
      "Deploy emergency security patch for zero-day vulnerability in authentication system",
    status: "completed",
    priority: "high",
    due_date: "2024-02-10",
    user_id: 2,
    created_by: 1,
    created_at: "2024-02-01 08:00:00",
    updated_at: "2024-02-09 14:30:00",
  },
  {
    title: "Production Database Migration",
    description:
      "Migrate production database to new cluster with zero downtime requirement",
    status: "in progress",
    priority: "high",
    due_date: "2024-03-05",
    user_id: 3,
    created_by: 1,
    created_at: "2024-02-15 09:15:00",
    updated_at: "2024-02-25 11:45:00",
  },
  {
    title: "Payment Gateway Integration",
    description: "Integrate Stripe payment gateway for new subscription model",
    status: "pending",
    priority: "high",
    due_date: "2024-03-12",
    user_id: 4,
    created_by: 1,
    created_at: "2024-02-20 10:30:00",
    updated_at: "2024-02-20 10:30:00",
  },
  {
    title: "Server Infrastructure Upgrade",
    description:
      "Upgrade server infrastructure to handle increased traffic load",
    status: "in progress",
    priority: "high",
    due_date: "2024-03-08",
    user_id: 5,
    created_by: 1,
    created_at: "2024-02-18 14:20:00",
    updated_at: "2024-02-28 16:20:00",
  },
  {
    title: "Data Breach Response",
    description:
      "Implement emergency measures following security incident detection",
    status: "completed",
    priority: "high",
    due_date: "2024-02-15",
    user_id: 6,
    created_by: 1,
    created_at: "2024-02-05 11:45:00",
    updated_at: "2024-02-14 09:15:00",
  },
  {
    title: "Mobile App Launch",
    description:
      "Finalize and launch mobile application on App Store and Play Store",
    status: "pending",
    priority: "high",
    due_date: "2024-03-20",
    user_id: 7,
    created_by: 1,
    created_at: "2024-02-22 13:30:00",
    updated_at: "2024-02-22 13:30:00",
  },
  {
    title: "API Rate Limiting Implementation",
    description:
      "Implement rate limiting to prevent API abuse and ensure service stability",
    status: "in progress",
    priority: "high",
    due_date: "2024-03-03",
    user_id: 8,
    created_by: 1,
    created_at: "2024-02-12 15:45:00",
    updated_at: "2024-02-26 10:25:00",
  },
  {
    title: "Customer Data Export Feature",
    description:
      "Build secure customer data export functionality for GDPR compliance",
    status: "completed",
    priority: "high",
    due_date: "2024-02-28",
    user_id: 9,
    created_by: 1,
    created_at: "2024-02-08 16:20:00",
    updated_at: "2024-02-27 14:10:00",
  },

  // Medium Priority Tasks (9)
  {
    title: "User Dashboard Redesign",
    description:
      "Redesign user dashboard with modern UI/UX and improved navigation",
    status: "in progress",
    priority: "medium",
    due_date: "2024-03-15",
    user_id: 10,
    created_by: 1,
    created_at: "2024-02-14 11:00:00",
    updated_at: "2024-02-29 14:30:00",
  },
  {
    title: "Documentation Overhaul",
    description:
      "Complete rewrite of technical documentation with examples and tutorials",
    status: "pending",
    priority: "medium",
    due_date: "2024-03-18",
    user_id: 11,
    created_by: 1,
    created_at: "2024-02-16 15:20:00",
    updated_at: "2024-02-16 15:20:00",
  },
  {
    title: "Performance Monitoring Setup",
    description:
      "Implement comprehensive application performance monitoring with alerts",
    status: "completed",
    priority: "medium",
    due_date: "2024-02-25",
    user_id: 12,
    created_by: 1,
    created_at: "2024-02-03 16:45:00",
    updated_at: "2024-02-24 10:25:00",
  },
  {
    title: "Email Notification System",
    description:
      "Build customizable email notification system for user activities",
    status: "in progress",
    priority: "medium",
    due_date: "2024-03-22",
    user_id: 13,
    created_by: 1,
    created_at: "2024-02-19 09:30:00",
    updated_at: "2024-02-27 13:15:00",
  },
  {
    title: "Search Functionality Improvement",
    description:
      "Enhance search with filters, sorting, and better relevance scoring",
    status: "pending",
    priority: "medium",
    due_date: "2024-03-25",
    user_id: 14,
    created_by: 1,
    created_at: "2024-02-21 14:10:00",
    updated_at: "2024-02-21 14:10:00",
  },
  {
    title: "Multi-language Support",
    description: "Add internationalization and support for multiple languages",
    status: "in progress",
    priority: "medium",
    due_date: "2024-04-05",
    user_id: 15,
    created_by: 1,
    created_at: "2024-02-23 10:45:00",
    updated_at: "2024-02-28 16:40:00",
  },
  {
    title: "Automated Testing Suite",
    description:
      "Create comprehensive automated testing suite for core features",
    status: "completed",
    priority: "medium",
    due_date: "2024-02-29",
    user_id: 2,
    created_by: 1,
    created_at: "2024-02-07 12:30:00",
    updated_at: "2024-02-28 11:20:00",
  },
  {
    title: "Customer Support Portal",
    description:
      "Build internal customer support portal with ticket management",
    status: "pending",
    priority: "medium",
    due_date: "2024-04-10",
    user_id: 3,
    created_by: 1,
    created_at: "2024-02-24 13:55:00",
    updated_at: "2024-02-24 13:55:00",
  },
  {
    title: "Data Analytics Dashboard",
    description:
      "Create analytics dashboard for business intelligence and metrics",
    status: "in progress",
    priority: "medium",
    due_date: "2024-04-02",
    user_id: 4,
    created_by: 1,
    created_at: "2024-02-26 08:20:00",
    updated_at: "2024-02-29 15:35:00",
  },

  // Low Priority Tasks (8)
  {
    title: "Code Refactoring - Legacy Modules",
    description:
      "Refactor legacy code modules for better maintainability and performance",
    status: "completed",
    priority: "low",
    due_date: "2024-03-30",
    user_id: 5,
    created_by: 1,
    created_at: "2024-02-10 10:15:00",
    updated_at: "2024-03-25 16:40:00",
  },
  {
    title: "Logo and Branding Update",
    description: "Update company logo and branding materials for consistency",
    status: "pending",
    priority: "low",
    due_date: "2024-04-15",
    user_id: 6,
    created_by: 1,
    created_at: "2024-02-25 11:25:00",
    updated_at: "2024-02-25 11:25:00",
  },
  {
    title: "Social Media Integration",
    description: "Add social media sharing and login capabilities",
    status: "in progress",
    priority: "low",
    due_date: "2024-04-20",
    user_id: 7,
    created_by: 1,
    created_at: "2024-02-20 13:50:00",
    updated_at: "2024-02-28 15:20:00",
  },
  {
    title: "User Feedback Analysis Report",
    description:
      "Analyze user feedback and compile improvement recommendations",
    status: "pending",
    priority: "low",
    due_date: "2024-04-25",
    user_id: 8,
    created_by: 1,
    created_at: "2024-02-27 16:35:00",
    updated_at: "2024-02-27 16:35:00",
  },
  {
    title: "Browser Compatibility Testing",
    description: "Test and fix compatibility issues across different browsers",
    status: "completed",
    priority: "low",
    due_date: "2024-03-10",
    user_id: 9,
    created_by: 1,
    created_at: "2024-02-11 12:40:00",
    updated_at: "2024-03-09 14:55:00",
  },
  {
    title: "Documentation Translation",
    description:
      "Translate documentation to Spanish and French for international users",
    status: "pending",
    priority: "low",
    due_date: "2024-05-01",
    user_id: 10,
    created_by: 1,
    created_at: "2024-02-28 09:15:00",
    updated_at: "2024-02-28 09:15:00",
  },
  {
    title: "Accessibility Compliance",
    description: "Ensure website meets WCAG 2.1 AA accessibility standards",
    status: "in progress",
    priority: "low",
    due_date: "2024-04-30",
    user_id: 11,
    created_by: 1,
    created_at: "2024-02-22 14:45:00",
    updated_at: "2024-02-29 11:30:00",
  },
  {
    title: "Blog Content Management System",
    description: "Build internal CMS for company blog and news updates",
    status: "completed",
    priority: "low",
    due_date: "2024-03-08",
    user_id: 12,
    created_by: 1,
    created_at: "2024-02-13 15:20:00",
    updated_at: "2024-03-07 10:45:00",
  },
];

// Insert users
function insertUsers() {
  return new Promise((resolve, reject) => {
    let processed = 0;

    users.forEach((user) => {
      db.run(
        `INSERT OR IGNORE INTO users (name, email, password, role, created_at) 
         VALUES (?, ?, ?, ?, ?)`,
        [user.name, user.email, user.password, user.role, user.created_at],
        function (err) {
          processed++;
          if (err) {
            console.error("❌ Error inserting user:", err);
          } else if (this.changes > 0) {
            console.log(`✅ Inserted user: ${user.name}`);
          } else {
            console.log(`⏭️  User already exists: ${user.name}`);
          }

          if (processed === users.length) resolve();
        }
      );
    });
  });
}

// Insert tasks
function insertTasks() {
  return new Promise((resolve, reject) => {
    let processed = 0;

    tasks.forEach((task) => {
      db.run(
        `INSERT OR IGNORE INTO tasks (title, description, status, priority, due_date, user_id, created_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.title,
          task.description,
          task.status,
          task.priority,
          task.due_date,
          task.user_id,
          task.created_by,
          task.created_at,
          task.updated_at,
        ],
        function (err) {
          processed++;
          if (err) {
            console.error("❌ Error inserting task:", err);
          } else if (this.changes > 0) {
            console.log(`✅ Inserted task: ${task.title}`);
          } else {
            console.log(`⏭️  Task already exists: ${task.title}`);
          }

          if (processed === tasks.length) resolve();
        }
      );
    });
  });
}

// Run the seed data insertion
async function runSeedData() {
  try {
    console.log("🌱 Starting database seeding...\n");

    console.log("👥 Inserting users...");
    await insertUsers();
    console.log(`\n✅ Successfully processed ${users.length} users\n`);

    console.log("📋 Inserting tasks...");
    await insertTasks();
    console.log(`\n✅ Successfully processed ${tasks.length} tasks\n`);

    // Display summary
    console.log("📊 SEEDING COMPLETE - DATA SUMMARY");
    console.log("==================================");
    console.log(`👥 Users: ${users.length} regular users`);
    console.log(`📋 Total Tasks: ${tasks.length}`);
    console.log("\n🎯 Task Priority Distribution:");
    const highPriority = tasks.filter((t) => t.priority === "high").length;
    const mediumPriority = tasks.filter((t) => t.priority === "medium").length;
    const lowPriority = tasks.filter((t) => t.priority === "low").length;
    console.log(`   🔴 High Priority: ${highPriority} tasks`);
    console.log(`   🟡 Medium Priority: ${mediumPriority} tasks`);
    console.log(`   🟢 Low Priority: ${lowPriority} tasks`);

    console.log("\n📈 Task Status Distribution:");
    const pending = tasks.filter((t) => t.status === "pending").length;
    const inProgress = tasks.filter((t) => t.status === "in progress").length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    console.log(`   ⏳ Pending: ${pending} tasks`);
    console.log(`   🚧 In Progress: ${inProgress} tasks`);
    console.log(`   ✅ Completed: ${completed} tasks`);

    console.log("\n🔑 TEST CREDENTIALS");
    console.log("==================");
    console.log('All users have the same password: "password"');
    console.log("\nSample user emails:");
    console.log("   📧 emma.thompson@techcorp.com");
    console.log("   📧 james.wilson@devstudio.io");
    console.log("   📧 sophia.chen@innovate.dev");
    console.log("   📧 ... and 12 more users");

    console.log("\n🎉 Database seeded successfully! Ready for testing.");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err.message);
      } else {
        console.log("\n🔒 Database connection closed.");
      }
    });
  }
}

// Run the seed script
runSeedData();
