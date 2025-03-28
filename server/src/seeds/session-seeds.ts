import { Session } from '../models/session';
import { User } from '../models/user';

export async function seedSessions() {
  try {
    // Get mentor and mentee IDs
    const mentor = await User.findOne({ where: { role: 'mentor' } });
    const mentee = await User.findOne({ where: { role: 'mentee' } });

    if (!mentor || !mentee) {
      console.log('Mentor or mentee not found. Skipping session seeding.');
      return;
    }

    // Create sample sessions
    await Session.create({
      mentorId: mentor.id,
      menteeId: mentee.id,
      status: 'scheduled',
      startTime: new Date('2024-03-20T10:00:00Z'),
      endTime: new Date('2024-03-20T11:00:00Z'),
      notes: 'JavaScript Fundamentals - Learn the basics of JavaScript programming',
    });

    await Session.create({
      mentorId: mentor.id,
      menteeId: mentee.id,
      status: 'completed',
      startTime: new Date('2024-03-21T14:00:00Z'),
      endTime: new Date('2024-03-21T15:30:00Z'),
      notes: 'React Hooks - Deep dive into React Hooks and their use cases',
    });

    await Session.create({
      mentorId: mentor.id,
      menteeId: mentee.id,
      status: 'scheduled',
      startTime: new Date('2024-03-25T09:00:00Z'),
      endTime: new Date('2024-03-25T10:00:00Z'),
      notes: 'TypeScript Best Practices - Learn TypeScript best practices and patterns',
    });

    console.log('Sessions seeded successfully');
  } catch (error) {
    console.error('Error seeding sessions:', error);
    throw error;
  }
}
