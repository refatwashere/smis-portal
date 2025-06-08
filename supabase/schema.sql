-- Create classes table
create table classes (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    grade text not null,
    subject text not null,
    schedule text,
    room text,
    teacher_id uuid references auth.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies for classes
alter table classes enable row level security;

create policy "Users can view all classes"
    on classes for select
    using (true);

create policy "Teachers can insert classes"
    on classes for insert
    using (auth.uid() = teacher_id);

create policy "Teachers can update their own classes"
    on classes for update
    using (auth.uid() = teacher_id);

create policy "Teachers can delete their own classes"
    on classes for delete
    using (auth.uid() = teacher_id);

-- Create trigger to update updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger update_classes_updated_at
    before update on classes
    for each row
    execute function update_updated_at_column();
