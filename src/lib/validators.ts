import { z } from "zod";

export const MaterialProjectV1Schema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["wall", "ceiling", "floor", "panel"]),
  zone: z.string(),
  status: z.enum(["draft", "in_progress", "ready", "blocked"]),
  region: z.string(),
  constraints: z.object({
    eps_policy: z.enum(["allowed", "forbidden"]),
    min_pull_off_mpa: z.number().min(0.1),
  }),
  targets: z.object({
    density_kg_m3: z.number(),
    strength_mpa: z.number(),
  }),
  recipe: z.object({
    w_g: z.number(),
    rdp_pct: z.number(),
    rheology_pct: z.number(),
    water_retention_pct: z.number(),
    basalt_fiber_pct: z.number(),
  }),
  variants: z.array(
    z.object({
      name: z.enum(["Eco", "Standard", "Pro"]),
      summary: z.string(),
      components: z.array(
        z.object({
          name: z.string(),
          ratio: z.number(),
          is_eps: z.boolean().optional(),
        })
      ),
    })
  ),
  economics: z.object({
    cost_per_ton: z.number(),
    margin_pct: z.number(),
  }),
});

export type MaterialProjectV1 = z.infer<typeof MaterialProjectV1Schema>;

export const QCPlanV1Schema = z.object({
  title: z.string(),
  checkpoints: z.array(
    z.object({
      step: z.string(),
      metric: z.string(),
      acceptance: z.string(),
    })
  ),
});

export const SOPDocV1Schema = z.object({
  title: z.string(),
  steps: z.array(
    z.object({
      step: z.string(),
      detail: z.string(),
    })
  ),
});
