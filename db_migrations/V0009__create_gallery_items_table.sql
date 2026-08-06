CREATE TABLE gallery_items (
    id SERIAL PRIMARY KEY,
    media_type VARCHAR(10) NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo', 'video')),
    url TEXT NOT NULL,
    caption VARCHAR(300),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);