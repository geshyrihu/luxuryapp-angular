import { Routes } from "@angular/router";
import { MockAspelDashboardComponent } from "./mock-aspel-dashboard";
import { MockAspelPolizaFormComponent } from "./mock-aspel-poliza-form";

export const MOCK_ASPEL_ROUTES: Routes = [
  { path: "", component: MockAspelDashboardComponent },
  { path: "nueva-poliza", component: MockAspelPolizaFormComponent },
];
