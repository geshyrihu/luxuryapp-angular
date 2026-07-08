import { TestBed } from "@angular/core/testing";
import { AvatarGroup } from "./avatar-group";

describe("AvatarGroup", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [AvatarGroup] });
    expect(TestBed.createComponent(AvatarGroup).componentInstance).toBeTruthy();
  });
});
