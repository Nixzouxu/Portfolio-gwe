-- ============================================
-- PostgreSQL Database Schema for Comments
-- ============================================

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Create index for faster queries
CREATE INDEX idx_created_at ON comments(created_at DESC);
CREATE INDEX idx_is_approved ON comments(is_approved);

-- Optional: Add constraints
ALTER TABLE comments
    ADD CONSTRAINT chk_name_length CHECK (LENGTH(name) >= 2),
    ADD CONSTRAINT chk_message_length CHECK (LENGTH(message) >= 5);

-- Sample data (optional - for testing)
INSERT INTO comments (name, email, message) VALUES
    ('John Doe', 'john@example.com', 'Great portfolio! Love the design.'),
    ('Jane Smith', 'jane@example.com', 'Your projects are really impressive!'),
    ('Alex Chen', 'alex@example.com', 'Clean code and beautiful UI. Keep it up!');

-- View to get approved comments only
CREATE OR REPLACE VIEW approved_comments AS
SELECT id, name, email, message, created_at
FROM comments
WHERE is_approved = TRUE
ORDER BY created_at DESC;

-- Success message
SELECT 'Database schema created successfully!' as status;
