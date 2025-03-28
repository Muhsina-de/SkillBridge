import { sequelize, User, Session, Review } from '../models';
import { seedDemoUser } from './demo-user';
import { seedForumTopics } from './forum-topics';
import { seedMentors } from './mentor-seeds';

/**
 * Seed all database tables in the correct order
 */
const seedAll = async () => {
  try {
    console.log('\n----- STARTING DATABASE SEEDING -----\n');

    // Initialize models without force sync
    console.log('Syncing database models...');
    await sequelize.sync({ force: false });
    console.log('\n----- DATABASE SYNCED -----\n');

    // Import seed functions
    console.log('Loading seed modules...');
    const { seedUserProfiles } = await import('./userprofile-seeds'); 
    const { seedSessions } = await import('./session-seeds');
    const { seedReviews } = await import('./review-seeds');
    const { seedMentees } = await import('./mentee-seeds');

    // Seed in order: Users -> Mentors -> Mentees -> Sessions -> Reviews -> Forum
    console.log('Seeding users...');
    await seedUserProfiles();
    console.log('\n----- USERS SEEDED -----\n');

    console.log('Seeding mentors...');
    await seedMentors();
    console.log('\n----- MENTORS SEEDED -----\n');

    console.log('Seeding mentees...');
    await seedMentees();
    console.log('\n----- MENTEES SEEDED -----\n');

    console.log('Seeding sessions...');
    await seedSessions();
    console.log('\n----- SESSIONS SEEDED -----\n');

    console.log('Seeding reviews...');
    await seedReviews();
    console.log('\n----- REVIEWS SEEDED -----\n');

    // Seed forum data
    console.log('Seeding forum topics and comments...');
    await seedForumTopics();
    console.log('\n----- FORUM DATA SEEDED -----\n');

    // Verify seeded data
    const userCount = await User.count();
    const sessionCount = await Session.count();
    const reviewCount = await Review.count();

    console.log('\n----- SEEDING SUMMARY -----');
    console.log(`Users seeded: ${userCount}`);
    console.log(`Sessions seeded: ${sessionCount}`);
    console.log(`Reviews seeded: ${reviewCount}`);
    console.log('\n----- ALL SEEDS COMPLETED SUCCESSFULLY -----\n');  

    // Exit successfully
    process.exit(0);
  } catch (err) {
    console.error('\n----- ERROR SEEDING DATABASE -----');
    if (err instanceof Error) {
      console.error('Error message:', err.message);
      console.error('Stack trace:', err.stack);
    } else {
      console.error('Unknown error:', err);
    }

    // Try to close database connection before exiting
    try {
      await sequelize.close();
    } catch (closeErr) {
      console.error('Error closing database connection:', closeErr);  
    }

    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n----- SEEDING INTERRUPTED -----');
  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
  process.exit(1);
});

// Start seeding
seedAll();