import { Routes } from "@angular/router";
import { recruitmentRoutes as legacyRecruitmentRoutes } from "src/app/routing/recruitment.routing";

export const recruitmentRoutes: Routes = [
  {
    path: "",
    children: legacyRecruitmentRoutes,
  },
];
