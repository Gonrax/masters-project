SET foreign_key_checks = 0;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_tokens;
SET foreign_key_checks = 1;

CREATE TABLE `users`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL
);

CREATE TABLE `jobs`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT UNSIGNED NOT NULL,
    `description_short` VARCHAR(255) NOT NULL,
    `description_long` VARCHAR(5000) NOT NULL,
    `timestamp_posted` DATETIME NOT NULL,
    `timestamp_closed` DATETIME NOT NULL,
    `auction_type` INT UNSIGNED NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `status` TINYINT(1) NOT NULL,
    `wage` INT UNSIGNED NOT NULL,
    `final_wage` INT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `winner_id` INT UNSIGNED NULL,
    `creator_id` INT UNSIGNED NOT NULL
);

CREATE TABLE `offers`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `job_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `offer` INT NOT NULL,
    `timestamp` DATETIME NOT NULL
);

CREATE TABLE `categories`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `user_tokens`(
	`token` VARCHAR(255) NOT NULL PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1 
);
ALTER TABLE
    `offers` ADD CONSTRAINT `offers_job_id_foreign` FOREIGN KEY(`job_id`) REFERENCES `jobs`(`id`);
ALTER TABLE
    `jobs` ADD CONSTRAINT `jobs_creator_id_foreign` FOREIGN KEY(`creator_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `offers` ADD CONSTRAINT `offers_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `jobs` ADD CONSTRAINT `jobs_winner_id_foreign` FOREIGN KEY(`winner_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `jobs` ADD CONSTRAINT `jobs_category_id_foreign` FOREIGN KEY(`category_id`) REFERENCES `categories`(`id`);
ALTER TABLE
    `user_tokens` ADD CONSTRAINT `user_tokens_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
    
INSERT into categories
(name) values ("Construction"),("Art"),("Cleaning"),("Software")