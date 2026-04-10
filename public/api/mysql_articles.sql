CREATE TABLE articles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(190) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  summary TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  author VARCHAR(190) NOT NULL DEFAULT 'Redacción',
  category VARCHAR(100) NOT NULL,
  image_url TEXT NULL,
  source_url TEXT NULL,
  breaking TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  published_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_articles_status_published (status, published_at),
  INDEX idx_articles_category (category)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
