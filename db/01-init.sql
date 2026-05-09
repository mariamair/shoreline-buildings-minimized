-- Create tables
CREATE TABLE IF NOT EXISTS region_type (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS region (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type_id INT,
    FOREIGN KEY (type_id)
        REFERENCES region_type (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    parent_code VARCHAR(2)
);

CREATE TABLE IF NOT EXISTS area_type (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS building_count (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    region_code VARCHAR(10),
    FOREIGN KEY (region_code)
        REFERENCES region (code)
        ON DELETE SET NULL ON UPDATE CASCADE,
    area_type_id INT,
    FOREIGN KEY (area_type_id)
        REFERENCES area_type (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    year INT NOT NULL,
    count INT,
    created_at TIMESTAMP (2) WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP (2) WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_building_count_id ON building_count(id);
CREATE INDEX IF NOT EXISTS idx_building_count_region_code ON building_count(region_code);
CREATE INDEX IF NOT EXISTS idx_building_count_area_type_id ON building_count(area_type_id);

CREATE INDEX IF NOT EXISTS idx_region_code ON region(code ASC);
CREATE INDEX IF NOT EXISTS idx_region_type_id ON region(type_id);
CREATE INDEX IF NOT EXISTS idx_region_parent_code ON region(parent_code);

-- Insert category data
INSERT INTO region_type (name) VALUES
    ('riket'),
    ('län'),
    ('kommun')
ON CONFLICT DO NOTHING;

INSERT INTO area_type (name) VALUES
    ('totalt'),
    ('inom tätort'),
    ('inom formellt skyddad natur')
ON CONFLICT DO NOTHING;
