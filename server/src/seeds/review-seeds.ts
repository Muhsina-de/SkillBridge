import { Review } from "../models/review";
import { User } from "../models/userprofile";
import { Session } from "../models/session";

export const seedReviews = async () => {
    try {
        // Find some existing users and sessions to reference
        const mentors = await User.findAll({ where: { role: 'mentor' }, limit: 3 });
        const mentees = await User.findAll({ where: { role: 'mentee' }, limit: 3 });
        const sessions = await Session.findAll({ where: { status: 'accepted' }, limit: 5 });

        if (mentors.length === 0 || mentees.length === 0 || sessions.length === 0) {
            console.log('Skipping review seeds: Required users or sessions not found');
            return;
        }

        const sampleReviews = [
            {
                sessionId: sessions[0].id,
                menteeId: sessions[0].menteeId,
                mentorId: sessions[0].mentorId,
                rating: 5,
                comment: "Excellent session! The mentor was very knowledgeable and helped me understand complex concepts clearly. Would definitely recommend!"
            },
            {
                sessionId: sessions[1].id,
                menteeId: sessions[1].menteeId,
                mentorId: sessions[1].mentorId,
                rating: 4,
                comment: "Great mentoring session. The mentor was patient and provided practical examples. Looking forward to applying what I learned."
            },
            {
                sessionId: sessions[2].id,
                menteeId: sessions[2].menteeId,
                mentorId: sessions[2].mentorId,
                rating: 5,
                comment: "Outstanding experience! The mentor went above and beyond to ensure I understood everything. Their real-world examples were particularly helpful."
            },
            {
                sessionId: sessions[3].id,
                menteeId: sessions[3].menteeId,
                mentorId: sessions[3].mentorId,
                rating: 4,
                comment: "Very productive session. The mentor shared valuable insights from their industry experience. Some technical issues at the start, but overall great."
            },
            {
                sessionId: sessions[4].id,
                menteeId: sessions[4].menteeId,
                mentorId: sessions[4].mentorId,
                rating: 5,
                comment: "Fantastic mentor! They provided clear explanations and shared useful resources. The session was well-structured and exactly what I needed."
            }
        ];

        // Clear existing reviews
        await Review.destroy({ where: {} });

        // Create new reviews
        await Review.bulkCreate(sampleReviews);

        console.log('Review seeds created successfully');
    } catch (error) {
        console.error('Error seeding reviews:', error);
        throw error;
    }
}; 