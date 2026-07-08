import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ThemeSwitcherBase } from "./theme-switcher.base";

@Component({ selector: "test-theme-switcher", standalone: true, template: "" })
class Host extends ThemeSwitcherBase {}

describe("ThemeSwitcherBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
