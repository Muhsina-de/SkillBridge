import { Session } from "../models/session.js";

export const seedSessions = async () => {   
    await Session.bulkCreate([
        {
            menteeId: 1,
            mentorId: 2,
            status: 'pending',
            date: '2021-10-01',
            time: '10:00:00',
            skill: 'javascript',
            price: 50,
            sessionNotes: 'Need help with React',
            duration: 60,
            message: 'Hello, I need help with React'
        },
        {
            menteeId: 2,
            mentorId: 1,
            status: 'accepted',
            date: '2021-10-02',
            time: '11:00:00',
            skill: 'node',
            price: 60,
            sessionNotes: 'Need help with Express',
            duration: 60,
            message: 'Hello, I need help with Express'
        },
        {
            menteeId: 3,
            mentorId: 2,
            status: 'rejected',
            date: '2021-10-03',
            time: '12:00:00',
            skill: 'react',
            price: 70,
            sessionNotes: 'Need help with Redux',
            duration: 60,
            message: 'Hello, I need help with Redux'
        },
        {
            menteeId: 4,
            mentorId: 1,
            status: 'cancelled',
            date: '2021-10-04',
            time: '13:00:00',
            skill: 'javascript',
            price: 80,
            sessionNotes: 'Need help with JavaScript',
            duration: 60,
            message: 'Hello, I need help with JavaScript'
        }
    ], {individualHooks: true});
}
