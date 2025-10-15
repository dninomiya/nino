CREATE TABLE `feed_items` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`date` integer NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`source` text NOT NULL,
	`content` text,
	`thumbnail` text,
	`raw_xml` text,
	`rss_url` text,
	`summary` text,
	`tags` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `url_date_idx` ON `feed_items` (`url`,`date`);