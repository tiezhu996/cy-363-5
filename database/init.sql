CREATE TABLE IF NOT EXISTS operation_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_name VARCHAR(120) NOT NULL,
  owner_name VARCHAR(80) NOT NULL,
  status VARCHAR(40) NOT NULL,
  metric VARCHAR(40) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO operation_records (module_name, owner_name, status, metric)
VALUES ('主题房间与难度分级', '运营组', 'ready', '100%');

CREATE TABLE IF NOT EXISTS themes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  type VARCHAR(40) NOT NULL,
  difficulty INT NOT NULL DEFAULT 1,
  suggested_players INT NOT NULL DEFAULT 4,
  duration INT NOT NULL DEFAULT 60,
  description TEXT,
  poster_url VARCHAR(255),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  theme_id INT NOT NULL,
  schedule_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_players INT NOT NULL DEFAULT 4,
  is_locked TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
  UNIQUE KEY unique_schedule (theme_id, schedule_date, start_time)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  schedule_id INT NOT NULL,
  player_name VARCHAR(80) NOT NULL,
  player_phone VARCHAR(20),
  player_count INT NOT NULL DEFAULT 1,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
);

INSERT INTO themes (name, type, difficulty, suggested_players, duration, description) VALUES
('午夜图书馆', '恐怖', 4, 6, 90, '午夜时分，你被困在一座古老的图书馆里，书页间隐藏着不可告人的秘密...'),
('星际迷航', '科幻', 3, 4, 60, '太空站突发故障，你需要在氧气耗尽前找到逃生舱...'),
('古埃及法老墓', '悬疑', 5, 8, 120, '深入法老墓，解开千年诅咒，寻找传说中的宝藏...');

INSERT INTO schedules (theme_id, schedule_date, start_time, end_time, max_players) VALUES
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '11:30:00', 6),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '15:30:00', 6),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:00:00', '20:30:00', 6),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', '12:00:00', 4),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '15:00:00', '16:00:00', 4),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:00:00', '21:00:00', 4),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '11:00:00', 8),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '13:00:00', '15:00:00', 8),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00:00', '20:00:00', 8),
(1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00:00', '11:30:00', 6),
(1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', '15:30:00', 6),
(2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '11:00:00', '12:00:00', 4),
(3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00:00', '11:00:00', 8);

INSERT INTO bookings (schedule_id, player_name, player_phone, player_count) VALUES
(1, '张三', '13800138001', 2),
(1, '李四', '13800138002', 3),
(2, '王五', '13800138003', 4),
(4, '赵六', '13800138004', 2),
(7, '钱七', '13800138005', 5),
(7, '孙八', '13800138006', 3);
