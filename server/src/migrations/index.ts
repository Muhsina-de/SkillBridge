import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection';

export async function up() {
    try {
        await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
        
        // Create users table first
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                skills JSONB DEFAULT '[]',
                role VARCHAR(50) NOT NULL,
                rating FLOAT DEFAULT 0,
                "profilePicture" VARCHAR(255),
                bio TEXT,
                availability JSONB DEFAULT '[]',
                location VARCHAR(255),
                linkedin VARCHAR(255),
                github VARCHAR(255),
                twitter VARCHAR(255),
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create reviews table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                "menteeId" INTEGER REFERENCES users(id),
                "mentorId" INTEGER REFERENCES users(id),
                rating INTEGER NOT NULL,
                comment TEXT,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create forum topics table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "forumTopics" (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                "userId" INTEGER REFERENCES users(id),
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create forum comments table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS "forumComments" (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL,
                "topicId" INTEGER REFERENCES "forumTopics"(id),
                "userId" INTEGER REFERENCES users(id),
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create sessions table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                "menteeId" INTEGER REFERENCES users(id),
                "mentorId" INTEGER REFERENCES users(id),
                status VARCHAR(50) NOT NULL,
                "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
                "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
                notes TEXT,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('All tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
}

export async function down() {
    try {
        // Drop tables in reverse order of creation
        await sequelize.query('DROP TABLE IF EXISTS sessions;');
        await sequelize.query('DROP TABLE IF EXISTS "forumComments";');
        await sequelize.query('DROP TABLE IF EXISTS "forumTopics";');
        await sequelize.query('DROP TABLE IF EXISTS reviews;');
        await sequelize.query('DROP TABLE IF EXISTS users;');
        await sequelize.query('DROP EXTENSION IF EXISTS "uuid-ossp";');

        console.log('All tables dropped successfully');
    } catch (error) {
        console.error('Error dropping tables:', error);
        throw error;
    }
}

// Run migrations if this file is executed directly
if (require.main === module) {
    up().then(() => {
        console.log('Migrations completed');
        process.exit(0);
    }).catch(error => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
} 