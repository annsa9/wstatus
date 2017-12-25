BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `w_lang` (
	`lang_id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`lang_type`	TEXT,
	`is_active`	INTEGER
);
CREATE TABLE IF NOT EXISTS `w_content` (
	`content_id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`content_text`	TEXT,
	`cat_id`	INTEGER,
	`lang_id`	INTEGER,
	`is_active`	INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS `w_category` (
	`cat_id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`category_type`	TEXT,
	`is_active`	INTEGER DEFAULT 0
);
INSERT INTO `w_category` VALUES (1,'Status',1);
INSERT INTO `w_category` VALUES (2,'Shayari',1);
INSERT INTO `w_category` VALUES (3,'Jokes',1);
INSERT INTO `w_category` VALUES (4,'Group links',1);
COMMIT;
