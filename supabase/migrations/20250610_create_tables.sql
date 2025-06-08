-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    grade VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    schedule TEXT,
    room VARCHAR(50),
    teacher_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies for classes
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Classes are viewable by authenticated users"
    ON classes FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Classes can be inserted by authenticated users"
    ON classes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Classes can be updated by authenticated users"
    ON classes FOR UPDATE
    USING (auth.role() = 'authenticated');
