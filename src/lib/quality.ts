import type { MaterialProjectV1 } from "@/lib/validators";

export type QualityIssue = {
  level: "warning" | "block";
  message: string;
};

export const evaluateQuality = (project: MaterialProjectV1): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  if (project.constraints.eps_policy === "forbidden") {
    const epsFound = project.variants.some((variant) =>
      variant.components.some((component) => component.is_eps)
    );
    if (epsFound) {
      issues.push({
        level: "block",
        message: "EPS запрещён политикой проекта.",
      });
    }
  }

  if (project.type === "ceiling") {
    if (project.recipe.w_g < 0.34 || project.recipe.w_g > 0.42) {
      issues.push({
        level: "block",
        message: "W/G должен быть в диапазоне 0.34–0.42 для потолочных смесей.",
      });
    }
    if (project.recipe.rdp_pct < 1.0) {
      issues.push({
        level: "warning",
        message: "RDP ниже 1.0% — возможное снижение адгезии.",
      });
    }
    if (project.recipe.rheology_pct < 0.1) {
      issues.push({
        level: "warning",
        message: "Rheology ниже 0.10% — высокий риск сползания.",
      });
    }
    if (project.recipe.water_retention_pct < 0.06) {
      issues.push({
        level: "warning",
        message: "WaterRetention ниже 0.06% — риск пересыхания.",
      });
    }
    if (project.targets.strength_mpa < project.constraints.min_pull_off_mpa) {
      issues.push({
        level: "block",
        message: "Адгезия ниже минимального требования — блок выпуска.",
      });
    }
  }

  return issues;
};
