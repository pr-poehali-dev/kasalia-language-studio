INSERT INTO students (full_name, kid_name, phone, password_hash, course) VALUES
('Иванова Мария', 'Иванов Артём', '+79138503338', '0ead2060b65992dca4769af601a1b3a35ef38cfad2c2c465bb160ea764157c5d', 'Английский');

INSERT INTO student_materials (student_id, title, description, file_url) VALUES
(1, 'Карточки Animals', 'Флеш-карточки с животными для повторения слов из блока', NULL),
(1, 'Песня Hello Song', 'Ссылка на песню-приветствие, которую разучивали на занятии', NULL);

INSERT INTO student_homework (student_id, title, description, due_date, status) VALUES
(1, 'Выучить 10 слов по теме Animals', 'Повторить карточки и попробовать назвать животных по памяти', CURRENT_DATE + INTERVAL '5 days', 'pending'),
(1, 'Нарисовать своего любимого питомца и подписать по-английски', 'Творческое задание для закрепления лексики', CURRENT_DATE + INTERVAL '7 days', 'pending');
