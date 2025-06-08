-- Add additional fields to classes table
ALTER TABLE classes
ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS current_students INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS prerequisites TEXT,
ADD COLUMN IF NOT EXISTS materials TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add constraints
ALTER TABLE classes
ADD CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'completed', 'cancelled')),
ADD CONSTRAINT valid_max_students CHECK (max_students > 0),
ADD CONSTRAINT valid_current_students CHECK (current_students >= 0 AND current_students <= max_students);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);
CREATE INDEX IF NOT EXISTS idx_classes_start_date ON classes(start_date);
CREATE INDEX IF NOT EXISTS idx_classes_end_date ON classes(end_date);

-- Create trigger to update current_students count
CREATE OR REPLACE FUNCTION update_current_students()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE classes
    SET current_students = (
        SELECT COUNT(*)
        FROM students
        WHERE students.class_id = NEW.class_id
    )
    WHERE id = NEW.class_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_class_students_count
AFTER INSERT OR DELETE ON students
FOR EACH ROW
EXECUTE FUNCTION update_current_students();
