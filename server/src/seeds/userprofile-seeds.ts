import { User } from "../models/userprofile.js";    

export const seedUserProfiles = async () => {
    await User.bulkCreate([
        {
            username: 'Mentor1'
            
        },
        {  
            email: 'mentor@menting.com',
        },
        {
            password: 'password'
        },
        {
            skills: ['javascript', 'react', 'node']
        },
        {
            role: 'mentor'
        },
        {
            rating: 4.5
        },
        {
            profilePicture: 'https://www.google.com',
        },
        {
            bio: 'I am a mentor'
        },
        {
            availability: ['monday', 'tuesday', 'wednesday']
        },
        {
            location: 'New York, NY'
        },
        {
            linkedin: 'https://www.linkedin.com'
        },
        {
            github: 'https://www.github.com'
        },
        {
            twitter: 'https://www.twitter.com'
        }
    ],   {individualHooks: true})
    
}   
    