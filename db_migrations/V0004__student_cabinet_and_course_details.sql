-- Ученики и кабинет ученика
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    kid_name VARCHAR(200),
    phone VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    course VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE student_materials (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    file_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE student_homework (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE student_sessions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    token VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    expires_at TIMESTAMP NOT NULL
);

-- Детали курсов (описание, преподаватель, фото)
CREATE TABLE course_details (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    lang VARCHAR(100) NOT NULL,
    full_description TEXT,
    teacher_name VARCHAR(200),
    teacher_role VARCHAR(200),
    teacher_photo TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE course_photos (
    id SERIAL PRIMARY KEY,
    course_slug VARCHAR(100) NOT NULL REFERENCES course_details(slug),
    photo_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);
