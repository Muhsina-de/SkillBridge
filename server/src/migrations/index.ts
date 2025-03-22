import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/connection';

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
                profilePicture VARCHAR(255),
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

        // Create sessions table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                "mentorId" INTEGER REFERENCES users(id),
                "menteeId" INTEGER REFERENCES users(id),
                status VARCHAR(50) NOT NULL,
                "startTime" TIMESTAMP WITH TIME ZONE,
                "endTime" TIMESTAMP WITH TIME ZONE,
                notes TEXT,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create reviews table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                "mentor_id" INTEGER REFERENCES users(id),
                "mentee_id" INTEGER REFERENCES users(id),
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}

export async function down() {
    try {
        await sequelize.query('DROP TABLE IF EXISTS sessions CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS reviews CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS users CASCADE;');
        console.log('Migration undone successfully');
    } catch (error) {
        console.error('Migration undo failed:', error);
        throw error;
    }
}

// Only run migrations if this file is run directly
if (require.main === module) {
    up().catch(console.error);
} 