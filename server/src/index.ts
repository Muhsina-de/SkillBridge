import app from './server';
import { sequelize } from './config/connection';
import { seedDemoUser } from './seeds/demo-user';
import { seedMentors } from './seeds/mentor-seeds';
import { clearForumData, seedForumTopics } from './seeds/forum-topics';
import { setupSocketIO } from './socket';
import config from './config';

if (process.env.NODE_ENV !== 'test') {
  // Sync database and seed if needed
  sequelize.sync({ force: false }).then(async () => {
    console.log('Database synced');
    await seedDemoUser();
    await seedMentors();
    await clearForumData();
    await seedForumTopics();
  });

  const server = app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });

  // Setup Socket.IO
  setupSocketIO(server);
}