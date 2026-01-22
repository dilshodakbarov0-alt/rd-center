import sections from "@/data/sections.json";

export type SectionSpec = {
  name: string;
  b: number;
  h: number;
};

export const sectionSpecs = sections.sections as SectionSpec[];
