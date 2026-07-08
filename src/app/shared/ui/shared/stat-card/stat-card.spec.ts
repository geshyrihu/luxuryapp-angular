import { TestBed } from "@angular/core/testing";
import { AppStatCard } from "./stat-card";

describe("AppStatCard", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [AppStatCard] });
    expect(TestBed.createComponent(AppStatCard).componentInstance).toBeTruthy();
  });
});
