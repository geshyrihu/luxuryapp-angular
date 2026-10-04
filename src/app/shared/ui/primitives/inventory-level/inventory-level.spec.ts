import { TestBed } from "@angular/core/testing";
import { AppInventoryLevel } from "../../primitives/inventory-level/inventory-level";

describe("AppInventoryLevel", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [AppInventoryLevel] });
    expect(TestBed.createComponent(AppInventoryLevel).componentInstance).toBeTruthy();
  });
});
