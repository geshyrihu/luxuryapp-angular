import { TestBed } from "@angular/core/testing";
import { LxProfileCard } from "./profile-card";

describe("LxProfileCard (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxProfileCard] });
    expect(TestBed.createComponent(LxProfileCard).componentInstance).toBeTruthy();
  });
});
