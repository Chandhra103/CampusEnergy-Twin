import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { activateWorkspaceSource, getWorkspaceState, persistUploadedDataset, saveApiConfig } from "./db";

const readingSchema = z.object({
  date: z.string(),
  time: z.string().optional(),
  building: z.string(),
  occupancy: z.string().optional(),
  temperature: z.string().optional(),
  acUsage: z.string().optional(),
  lightingUsage: z.string().optional(),
  equipmentUsage: z.string().optional(),
  energyConsumption: z.string(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  data: router({
    workspace: publicProcedure.query(() => getWorkspaceState()),
    activateSource: publicProcedure.input(z.object({ source: z.enum(["demo", "uploaded", "simulated"]) })).mutation(({ input }) => activateWorkspaceSource(input.source)),
    saveApiConfig: publicProcedure.input(z.object({ endpoint: z.string(), key: z.string().optional(), building: z.string(), meter: z.string(), interval: z.number().int().min(5).max(86400) })).mutation(({ input }) => saveApiConfig(input)),
    importDataset: publicProcedure.input(z.object({
      name: z.string().min(1).max(255),
      buildingCount: z.number().int().nonnegative(),
      totalEnergy: z.number().nonnegative(),
      dateRange: z.string().max(255),
      rows: z.array(readingSchema).min(1).max(100000),
    })).mutation(({ input }) => persistUploadedDataset(input)),
  }),
});

export type AppRouter = typeof appRouter;
