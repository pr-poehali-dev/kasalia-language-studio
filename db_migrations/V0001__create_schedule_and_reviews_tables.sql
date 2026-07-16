CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    days VARCHAR(50) NOT NULL,
    time_range VARCHAR(50) NOT NULL,
    course VARCHAR(200) NOT NULL,
    color VARCHAR(30) NOT NULL DEFAULT 'text-primary',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO schedule (days, time_range, course, color, sort_order) VALUES
('Пн / Ср', '18:00', 'Английский · дошколята', 'text-primary', 1),
('Вт / Чт', '18:00', 'Английский · школьники', 'text-primary', 2),
('Пн / Ср', '19:00', 'Китайский · дошколята', 'text-secondary', 3),
('Вт / Чт', '19:00', 'Китайский · школьники', 'text-secondary', 4),
('Пт', '17:00–19:00', 'Театральные постановки на английском', 'text-purple', 5),
('Сб', '10:00–13:00', 'Мини-сад · театральные постановки', 'text-purple', 6),
('Сб', '14:00–17:00', 'Группа выходного дня · 1–4 класс', 'text-purple', 7);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    kid VARCHAR(200) NOT NULL,
    text TEXT NOT NULL,
    stars INTEGER NOT NULL DEFAULT 5,
    approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);