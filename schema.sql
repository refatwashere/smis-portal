-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (for Supabase auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    grade VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    schedule TEXT,
    room VARCHAR(50),
    teacher_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    identifier VARCHAR(100) UNIQUE NOT NULL,
    class_id UUID REFERENCES classes(id),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    dob DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updates table
CREATE TABLE IF NOT EXISTS updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_updates_created_by ON updates(created_by);

-- Enable RLS (Row Level Security) for all tables
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Classes are viewable by authenticated users"
    ON classes FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Classes can be inserted by authenticated users"
    ON classes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Classes can be updated by authenticated users"
    ON classes FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Students are viewable by authenticated users"
    ON students FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Students can be inserted by authenticated users"
    ON students FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Updates are viewable by authenticated users"
    ON updates FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Updates can be inserted by authenticated users"
    ON updates FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
