DROP INDEX `url_date_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `feed_items_url_date_unique` ON `feed_items` (`url`,`date`);--> statement-breakpoint
DROP INDEX `status_latest_provider_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `status_latest_provider_unique` ON `status_latest` (`provider`);