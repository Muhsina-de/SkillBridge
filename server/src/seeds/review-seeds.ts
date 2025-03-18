import { Review } from "../models/review";
import { User } from "../models/userprofile";
import { Session } from "../models/session";

export const seedReviews = async () => {
    try {
        // Find some existing users and sessions to reference
        const mentors = await User.findAll({ where: { role: 'mentor' }, limit: 3 });
        const mentees = await User.findAll({ where: { role: 'mentee' }, limit: 3 });
        const sessions = await Session.findAll({ where: { status: 'accepted' }, limit: 3 });

        console.log('Found sessions:', sessions.length);
        console.log('Found mentors:', mentors.length);
        console.log('Found mentees:', mentees.length);

        if (mentors.length === 0 || mentees.length === 0 || sessions.length === 0) {
            console.log('Skipping review seeds: Required users or sessions not found');
            return;
        }

        // Clear existing reviews
        await Review.destroy({ where: {} });

        // Create reviews only for accepted sessions
        for (const session of sessions) {
            if (session.status === 'accepted') {
                await Review.create({
                    session_id: session.id,
                    mentee_id: session.menteeId,
                    mentor_id: session.mentorId,
                    rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
                    comment: "Great session! The mentor was very helpful and knowledgeable."
                });
            }
        }

        console.log('Review seeds created successfully');
    } catch (error) {
        console.error('Error seeding reviews:', error);
        throw error;
    }
}; 