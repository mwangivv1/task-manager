CREATE DATABASE collaborative_task_manager;
USE collaborative_task_manager;

-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams Table
CREATE TABLE teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Team Members Table (Many-to-Many)
CREATE TABLE team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    user_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Tasks Table
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    deadline DATE,
    created_by INT,
    assigned_to INT,
    team_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    FOREIGN KEY (assigned_to) REFERENCES users(user_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- Comments Table
CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    user_id INT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
USE collaborative_task_manager;

-- Insert Users
INSERT INTO users (full_name, email, password, role)
VALUES
('John Mwangi', 'john@example.com', 'hashed_password_1', 'admin'),
('Mary Wanjiku', 'mary@example.com', 'hashed_password_2', 'member'),
('Peter Otieno', 'peter@example.com', 'hashed_password_3', 'member');

-- Insert Teams
INSERT INTO teams (team_name, created_by)
VALUES
('Development Team', 1),
('Design Team', 2);

-- Insert Team Members
INSERT INTO team_members (team_id, user_id)
VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 2);

-- Insert Tasks
INSERT INTO tasks (
    title,
    description,
    priority,
    status,
    deadline,
    created_by,
    assigned_to,
    team_id
)
VALUES
(
    'Develop Login System',
    'Create JWT authentication for user login and registration',
    'High',
    'In Progress',
    '2026-05-10',
    1,
    2,
    1
),
(
    'Design Dashboard UI',
    'Create frontend dashboard layout using React.js',
    'Medium',
    'Pending',
    '2026-05-15',
    2,
    3,
    2
),
(
    'Setup Notification Module',
    'Create task deadline reminder notifications',
    'High',
    'Pending',
    '2026-05-20',
    1,
    3,
    1
);

-- Insert Comments
INSERT INTO comments (task_id, user_id, message)
VALUES
(1, 2, 'I have completed the login API structure.'),
(1, 1, 'Good work, proceed with token validation.'),
(2, 3, 'I will start the UI wireframe today.');

-- Insert Notifications
INSERT INTO notifications (user_id, message)
VALUES
(2, 'You have been assigned a new task: Develop Login System'),
(3, 'Deadline approaching for Design Dashboard UI'),
(3, 'You have been assigned a new task: Setup Notification Module');
USE collaborative_task_manager;

-- 1. View All Tasks with Assigned User and Team
SELECT 
    t.task_id,
    t.title,
    t.priority,
    t.status,
    t.deadline,
    u.full_name AS assigned_user,
    tm.team_name
FROM tasks t
JOIN users u ON t.assigned_to = u.user_id
JOIN teams tm ON t.team_id = tm.team_id;

-- 2. View Pending Tasks Only
SELECT 
    task_id,
    title,
    priority,
    deadline
FROM tasks
WHERE status = 'Pending';

-- 3. View Completed Tasks
SELECT 
    task_id,
    title,
    assigned_to,
    deadline
FROM tasks
WHERE status = 'Completed';

-- 4. Count Total Tasks per User
SELECT 
    u.full_name,
    COUNT(t.task_id) AS total_tasks
FROM users u
LEFT JOIN tasks t ON u.user_id = t.assigned_to
GROUP BY u.full_name;

-- 5. Count Tasks by Status
SELECT 
    status,
    COUNT(*) AS total
FROM tasks
GROUP BY status;

-- 6. Tasks Near Deadline (Next 7 Days)
SELECT 
    title,
    deadline,
    status
FROM tasks
WHERE deadline BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);

-- 7. View Comments for a Specific Task
SELECT 
    c.comment_id,
    u.full_name,
    c.message,
    c.created_at
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.task_id = 1;

-- 8. View Notifications for a User
SELECT 
    notification_id,
    message,
    is_read,
    created_at
FROM notifications
WHERE user_id = 3;

-- 9. Update Task Status
UPDATE tasks
SET status = 'Completed'
WHERE task_id = 1;

-- 10. Delete Completed Tasks (Optional)
DELETE FROM tasks
WHERE status = 'Completed';

-- 11. Search Tasks by Priority
SELECT 
    task_id,
    title,
    priority,
    status
FROM tasks
WHERE priority = 'High';

-- 12. View Team Members
SELECT 
    tm.team_name,
    u.full_name
FROM team_members t
JOIN teams tm ON t.team_id = tm.team_id
JOIN users u ON t.user_id = u.user_id
ORDER BY tm.team_name;