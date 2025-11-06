ALTER TABLE `profiles` ADD `last_task_completed_at` integer;--> statement-breakpoint
ALTER TABLE `profiles` ADD `tasks_public` integer DEFAULT false NOT NULL;--> statement-breakpoint
-- 既存データの移行: todo_settings.tasks_public を profiles.tasks_public に移行
UPDATE `profiles` 
SET `tasks_public` = (
  SELECT `tasks_public` 
  FROM `todo_settings` 
  WHERE `todo_settings`.`user_id` = `profiles`.`user_id`
)
WHERE EXISTS (
  SELECT 1 
  FROM `todo_settings` 
  WHERE `todo_settings`.`user_id` = `profiles`.`user_id`
);--> statement-breakpoint
ALTER TABLE `todo_settings` DROP COLUMN `tasks_public`;