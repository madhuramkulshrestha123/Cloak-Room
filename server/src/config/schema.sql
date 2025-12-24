-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255), -- Added username field
    name VARCHAR(191), -- Can be NULL for anonymous users
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255), -- Added password field for manual registration
    provider VARCHAR(50) NOT NULL DEFAULT 'manual', -- Added provider field to distinguish auth method
    oauth_id VARCHAR(255), -- This will be NULL for manual registration
    age INTEGER, -- Added age field
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add username column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='username') THEN
        ALTER TABLE users ADD COLUMN username VARCHAR(255);
    END IF;
END $$;

-- Add name column if it doesn't exist or modify if it exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='name') THEN
        ALTER TABLE users ADD COLUMN name VARCHAR(191);
    ELSE
        ALTER TABLE users ALTER COLUMN name DROP NOT NULL;
    END IF;
END $$;

-- Add age column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='age') THEN
        ALTER TABLE users ADD COLUMN age INTEGER;
    END IF;
END $$;

-- Add provider column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='provider') THEN
        ALTER TABLE users ADD COLUMN provider VARCHAR(50) NOT NULL DEFAULT 'manual';
    END IF;
END $$;

-- Add oauth_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='oauth_id') THEN
        ALTER TABLE users ADD COLUMN oauth_id VARCHAR(255);
    END IF;
END $$;

-- Create chat_groups table
CREATE TABLE IF NOT EXISTS chat_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER NOT NULL,
    title VARCHAR(191) NOT NULL,
    passcode VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on chat_groups for user_id and created_at
CREATE INDEX IF NOT EXISTS idx_chat_groups_user_created ON chat_groups (user_id, created_at);

-- Create group_users table
CREATE TABLE IF NOT EXISTS group_users (
    id SERIAL PRIMARY KEY,
    group_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES chat_groups(id) ON DELETE CASCADE
);

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='group_users' AND column_name='user_id') THEN
        ALTER TABLE group_users ADD COLUMN user_id INTEGER;
        ALTER TABLE group_users ADD CONSTRAINT fk_group_users_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL,
    message TEXT,
    name VARCHAR(255) NOT NULL,
    file TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES chat_groups(id) ON DELETE CASCADE
);

-- Create index on chats for created_at
CREATE INDEX IF NOT EXISTS idx_chats_created ON chats (created_at);