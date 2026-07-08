import { TestBed } from "@angular/core/testing";
import { AppRealtimeIndicator } from "./realtime-indicator";

describe("AppRealtimeIndicator", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [AppRealtimeIndicator] });
    expect(TestBed.createComponent(AppRealtimeIndicator).componentInstance).toBeTruthy();
  });
});
