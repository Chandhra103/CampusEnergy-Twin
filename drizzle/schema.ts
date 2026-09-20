import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const campusDatasets = mysqlTable("campus_datasets", {
  id: int("id").autoincrement().primaryKey(),
  sourceType: mysqlEnum("sourceType", ["demo", "uploaded", "simulated"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  recordCount: int("recordCount").notNull().default(0),
  buildingCount: int("buildingCount").notNull().default(0),
  totalEnergy: varchar("totalEnergy", { length: 64 }).notNull().default("0"),
  dateRange: varchar("dateRange", { length: 255 }).notNull().default("Not available"),
  isActive: int("isActive").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const campusEnergyReadings = mysqlTable("campus_energy_readings", {
  id: int("id").autoincrement().primaryKey(),
  datasetId: int("datasetId").notNull(),
  date: varchar("date", { length: 32 }).notNull(),
  time: varchar("time", { length: 32 }),
  building: varchar("building", { length: 255 }).notNull(),
  occupancy: varchar("occupancy", { length: 64 }),
  temperature: varchar("temperature", { length: 64 }),
  acUsage: varchar("acUsage", { length: 64 }),
  lightingUsage: varchar("lightingUsage", { length: 64 }),
  equipmentUsage: varchar("equipmentUsage", { length: 64 }),
  energyConsumption: varchar("energyConsumption", { length: 64 }).notNull(),
});

export const dataSourceConfigs = mysqlTable("data_source_configs", {
  id: int("id").autoincrement().primaryKey(),
  workspaceKey: varchar("workspaceKey", { length: 128 }).notNull().unique(),
  activeSource: mysqlEnum("activeSource", ["demo", "uploaded", "simulated"]).notNull().default("demo"),
  apiEndpoint: text("apiEndpoint"),
  apiKey: text("apiKey"),
  apiBuilding: varchar("apiBuilding", { length: 255 }),
  apiMeter: varchar("apiMeter", { length: 255 }),
  apiInterval: int("apiInterval").notNull().default(60),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CampusDataset = typeof campusDatasets.$inferSelect;
export type CampusEnergyReading = typeof campusEnergyReadings.$inferSelect;
export type DataSourceConfig = typeof dataSourceConfigs.$inferSelect;
