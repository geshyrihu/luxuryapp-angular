import { TestBed } from "@angular/core/testing";
import { ActivityLog } from "./activity-log";

describe("ActivityLog", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [ActivityLog] });
    expect(TestBed.createComponent(ActivityLog).componentInstance).toBeTruthy();
  });
});
