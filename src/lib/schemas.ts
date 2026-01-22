export const MaterialProjectV1JsonSchema = {
  name: "MaterialProjectV1",
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "name",
      "type",
      "zone",
      "status",
      "region",
      "constraints",
      "targets",
      "recipe",
      "variants",
      "economics",
    ],
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      type: { type: "string", enum: ["wall", "ceiling", "floor", "panel"] },
      zone: { type: "string" },
      status: { type: "string", enum: ["draft", "in_progress", "ready", "blocked"] },
      region: { type: "string" },
      constraints: {
        type: "object",
        required: ["eps_policy", "min_pull_off_mpa"],
        properties: {
          eps_policy: { type: "string", enum: ["allowed", "forbidden"] },
          min_pull_off_mpa: { type: "number" },
        },
      },
      targets: {
        type: "object",
        required: ["density_kg_m3", "strength_mpa"],
        properties: {
          density_kg_m3: { type: "number" },
          strength_mpa: { type: "number" },
        },
      },
      recipe: {
        type: "object",
        required: [
          "w_g",
          "rdp_pct",
          "rheology_pct",
          "water_retention_pct",
          "basalt_fiber_pct",
        ],
        properties: {
          w_g: { type: "number" },
          rdp_pct: { type: "number" },
          rheology_pct: { type: "number" },
          water_retention_pct: { type: "number" },
          basalt_fiber_pct: { type: "number" },
        },
      },
      variants: {
        type: "array",
        items: {
          type: "object",
          required: ["name", "summary", "components"],
          properties: {
            name: { type: "string", enum: ["Eco", "Standard", "Pro"] },
            summary: { type: "string" },
            components: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "ratio"],
                properties: {
                  name: { type: "string" },
                  ratio: { type: "number" },
                  is_eps: { type: "boolean" },
                },
              },
            },
          },
        },
      },
      economics: {
        type: "object",
        required: ["cost_per_ton", "margin_pct"],
        properties: {
          cost_per_ton: { type: "number" },
          margin_pct: { type: "number" },
        },
      },
    },
  },
};

export const QCPlanV1JsonSchema = {
  name: "QCPlanV1",
  schema: {
    type: "object",
    required: ["title", "checkpoints"],
    properties: {
      title: { type: "string" },
      checkpoints: {
        type: "array",
        items: {
          type: "object",
          required: ["step", "metric", "acceptance"],
          properties: {
            step: { type: "string" },
            metric: { type: "string" },
            acceptance: { type: "string" },
          },
        },
      },
    },
  },
};

export const SOPDocV1JsonSchema = {
  name: "SOPDocV1",
  schema: {
    type: "object",
    required: ["title", "steps"],
    properties: {
      title: { type: "string" },
      steps: {
        type: "array",
        items: {
          type: "object",
          required: ["step", "detail"],
          properties: {
            step: { type: "string" },
            detail: { type: "string" },
          },
        },
      },
    },
  },
};
