CREATE TABLE `campus_datasets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceType` enum('demo','uploaded','simulated') NOT NULL,
	`name` varchar(255) NOT NULL,
	`recordCount` int NOT NULL DEFAULT 0,
	`buildingCount` int NOT NULL DEFAULT 0,
	`totalEnergy` varchar(64) NOT NULL DEFAULT '0',
	`dateRange` varchar(255) NOT NULL DEFAULT 'Not available',
	`isActive` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campus_datasets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campus_energy_readings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datasetId` int NOT NULL,
	`date` varchar(32) NOT NULL,
	`time` varchar(32),
	`building` varchar(255) NOT NULL,
	`occupancy` varchar(64),
	`temperature` varchar(64),
	`acUsage` varchar(64),
	`lightingUsage` varchar(64),
	`equipmentUsage` varchar(64),
	`energyConsumption` varchar(64) NOT NULL,
	CONSTRAINT `campus_energy_readings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `data_source_configs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceKey` varchar(128) NOT NULL,
	`activeSource` enum('demo','uploaded','simulated') NOT NULL DEFAULT 'demo',
	`apiEndpoint` text,
	`apiKey` text,
	`apiBuilding` varchar(255),
	`apiMeter` varchar(255),
	`apiInterval` int NOT NULL DEFAULT 60,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `data_source_configs_id` PRIMARY KEY(`id`),
	CONSTRAINT `data_source_configs_workspaceKey_unique` UNIQUE(`workspaceKey`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
