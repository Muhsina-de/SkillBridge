import { User } from "../models";

export const seedUserProfiles = async () => {
    try {
        await User.bulkCreate([
            {
                username: 'JohnDoe',
                email: 'john@example.com',
                password: 'password123',
                role: 'mentor',
                skills: ['JavaScript', 'React', 'Node.js'],
                rating: 4.5,
                profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
                bio: 'Experienced full-stack developer with 5 years of teaching experience',
                availability: ['Monday', 'Wednesday', 'Friday'],
                location: 'New York, NY',
                linkedin: 'https://linkedin.com/in/johndoe',
                github: 'https://github.com/johndoe',
                twitter: 'https://twitter.com/johndoe'
            },
            {
                username: 'JaneSmith',
                email: 'jane@example.com',
                password: 'password123',
                role: 'mentee',
                skills: ['HTML', 'CSS'],
                rating: 0,
                profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
                bio: 'Aspiring web developer looking to learn React',
                availability: ['Tuesday', 'Thursday', 'Saturday'],
                location: 'San Francisco, CA',
                linkedin: 'https://linkedin.com/in/janesmith',
                github: 'https://github.com/janesmith',
                twitter: 'https://twitter.com/janesmith'
            },
            {
                username: 'BobJohnson',
                email: 'bob@example.com',
                password: 'password123',
                role: 'mentor',
                skills: ['Python', 'Django', 'PostgreSQL'],
                rating: 4.8,
                profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
                bio: 'Backend developer specializing in Python and databases',
                availability: ['Monday', 'Tuesday', 'Wednesday'],
                location: 'Chicago, IL',
                linkedin: 'https://linkedin.com/in/bobjohnson',
                github: 'https://github.com/bobjohnson',
                twitter: 'https://twitter.com/bobjohnson'
            }
        ], { individualHooks: true });
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
};   
    