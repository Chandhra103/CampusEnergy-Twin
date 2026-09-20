import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { campusDatasets, campusEnergyReadings, dataSourceConfigs, InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type PersistedReading = {
  date: string;
  time?: string;
  building: string;
  occupancy?: string;
  temperature?: string;
  acUsage?: string;
  lightingUsage?: string;
  equipmentUsage?: string;
  energyConsumption: string;
};

const WORKSPACE_KEY = "campus-energy-twin";

export async function getWorkspaceState() {
  const db = await getDb();
  if (!db) return null;
  const config = (await db.select().from(dataSourceConfigs).where(eq(dataSourceConfigs.workspaceKey, WORKSPACE_KEY)).limit(1))[0];
  const dataset = (await db.select().from(campusDatasets).where(eq(campusDatasets.isActive, 1)).orderBy(desc(campusDatasets.updatedAt)).limit(1))[0];
  return {
    activeSource: config?.activeSource ?? "demo",
    activeDataset: dataset
      ? { name: dataset.name, rows: dataset.recordCount, buildings: dataset.buildingCount, totalEnergy: Number(dataset.totalEnergy), dateRange: dataset.dateRange }
      : null,
    apiConfig: config
      ? { endpoint: config.apiEndpoint ?? "", building: config.apiBuilding ?? "", meter: config.apiMeter ?? "", interval: config.apiInterval }
      : { endpoint: "", building: "", meter: "", interval: 60 },
  };
}

export async function activateWorkspaceSource(source: "demo" | "uploaded" | "simulated") {
  const db = await getDb();
  if (!db) return { activeSource: source };
  const existing = (await db.select().from(dataSourceConfigs).where(eq(dataSourceConfigs.workspaceKey, WORKSPACE_KEY)).limit(1))[0];
  if (existing) {
    await db.update(dataSourceConfigs).set({ activeSource: source }).where(eq(dataSourceConfigs.workspaceKey, WORKSPACE_KEY));
  } else {
    await db.insert(dataSourceConfigs).values({ workspaceKey: WORKSPACE_KEY, activeSource: source });
  }
  if (source === "demo") await db.update(campusDatasets).set({ isActive: 0 });
  return { activeSource: source };
}

export async function saveApiConfig(input: { endpoint: string; key?: string; building: string; meter: string; interval: number }) {
  const db = await getDb();
  if (!db) return { saved: false };
  const existing = (await db.select().from(dataSourceConfigs).where(eq(dataSourceConfigs.workspaceKey, WORKSPACE_KEY)).limit(1))[0];
  const values = { apiEndpoint: input.endpoint || null, apiKey: input.key || null, apiBuilding: input.building || null, apiMeter: input.meter || null, apiInterval: input.interval };
  if (existing) await db.update(dataSourceConfigs).set(values).where(eq(dataSourceConfigs.workspaceKey, WORKSPACE_KEY));
  else await db.insert(dataSourceConfigs).values({ workspaceKey: WORKSPACE_KEY, ...values });
  return { saved: true };
}

export async function persistUploadedDataset(input: { name: string; rows: PersistedReading[]; buildingCount: number; totalEnergy: number; dateRange: string }) {
  const db = await getDb();
  if (!db) return { persisted: false };
  return db.transaction(async (tx) => {
    await tx.update(campusDatasets).set({ isActive: 0 });
    const inserted = await tx.insert(campusDatasets).values({
      sourceType: "uploaded",
      name: input.name,
      recordCount: input.rows.length,
      buildingCount: input.buildingCount,
      totalEnergy: String(input.totalEnergy),
      dateRange: input.dateRange,
      isActive: 1,
    });
    const datasetId = Number(inserted[0].insertId);
    for (let index = 0; index < input.rows.length; index += 500) {
      const batch = input.rows.slice(index, index + 500).map((row) => ({ datasetId, ...row }));
      if (batch.length) await tx.insert(campusEnergyReadings).values(batch);
    }
    const existing = (await tx.select().from(dataSourceConfigs).where(eq(dataSourceConfigs.workspaceKey, WORKSPACE_KEY)).limit(1))[0];
    if (existing) await tx.update(dataSourceConfigs).set({ activeSource: "uploaded" }).where(eq(dataSourceConfigs.workspaceKey, WORKSPACE_KEY));
    else await tx.insert(dataSourceConfigs).values({ workspaceKey: WORKSPACE_KEY, activeSource: "uploaded" });
    return { persisted: true, datasetId };
  });
}
