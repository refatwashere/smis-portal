-- Create updates table
CREATE TABLE IF NOT EXISTS updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies for updates
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Updates are viewable by authenticated users"
    ON updates FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Updates can be inserted by authenticated users"
    ON updates FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Updates can be updated by authenticated users"
    ON updates FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_updates_created_by ON updates(created_by);
CREATE INDEX IF NOT EXISTS idx_updates_category ON updates(category);
