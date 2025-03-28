import app from './server';
import { sequelize } from './config/connection';
import { seedDemoUser } from './seeds/demo-user';
import { seedMentors } from './seeds/mentor-seeds';
import { clearForumData, seedForumTopics } from './seeds/forum-topics';
import { setupSocketIO } from './socket';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

if (process.env.NODE_ENV !== 'test') {
  // Sync database and seed if needed
  sequelize.sync({ force: false }).then(async () => {
    console.log('Database synced');
    await seedDemoUser();
    await seedMentors();
    await clearForumData();
    await seedForumTopics();
  });

  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Setup Socket.IO
  setupSocketIO(server);
}