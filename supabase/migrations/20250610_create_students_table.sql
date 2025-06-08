-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    identifier VARCHAR(100) UNIQUE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    dob DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies for students
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students are viewable by authenticated users"
    ON students FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Students can be inserted by authenticated users"
    ON students FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Students can be updated by authenticated users"
    ON students FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_identifier ON students(identifier);
