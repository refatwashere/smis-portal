# SMIS - WEB PORTAL

A web-based Student Management Information System for St. Mary's International School (SMIS). This portal helps teachers manage classes, materials, students, and student updates.

## Features

- Class Management
  - Create and manage classes
  - Add class descriptions
  - View class materials and students
- Material Management
  - Add class materials (notes, files)
  - Organize materials by class
- Student Management
  - Add and manage students
  - Track student identifiers
  - View student updates
- Student Updates
  - Track academic and behavioral updates
  - Categorize updates
  - View update history

## Tech Stack

- Frontend: React
- UI: Tailwind CSS
- Icons: Lucide React
- Backend: Supabase (Database + Authentication)
- Real-time: Supabase Realtime Subscriptions

## Project Structure

```
smis-portal/
├── public/                 # Static files
├── src/                    # Source code
│   ├── components/         # React components
│   │   └── Modal.js        # Reusable modal component
│   ├── App.js             # Main application component
│   ├── App.css            # App styles
│   ├── index.js           # Application entry point
│   ├── index.css          # Global styles
│   ├── reportWebVitals.js # Performance monitoring
│   └── setupTests.js      # Test setup
├── utils/                 # Utility functions
├── .env                   # Environment variables
├── package.json          # Project dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md            # Project documentation
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy the SQL schema from the plan.txt file to create the necessary tables:
   - classes
   - materials
   - students
   - student_updates
3. Update the .env file with your Supabase credentials
4. Run the development server

## Database Schema

The application uses a PostgreSQL database with the following tables:

- `classes`
  - id (UUID)
  - teacher_id (UUID)
  - name (TEXT)
  - description (TEXT)
  - created_at (TIMESTAMPTZ)

- `materials`
  - id (UUID)
  - class_id (UUID)
  - title (TEXT)
  - content (TEXT)
  - type (TEXT)
  - created_at (TIMESTAMPTZ)

- `students`
  - id (UUID)
  - class_id (UUID)
  - name (TEXT)
  - identifier (TEXT)
  - created_at (TIMESTAMPTZ)

- `student_updates`
  - id (UUID)
  - student_id (UUID)
  - teacher_id (UUID)
  - text (TEXT)
  - category (TEXT)
  - created_at (TIMESTAMPTZ)

## Security

The application uses Row Level Security (RLS) in Supabase to ensure:
- Teachers can only access their own classes
- Materials can only be managed for classes owned by the teacher
- Students can only be added to classes owned by the teacher
- Updates can only be made by teachers for students in their classes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.(https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
