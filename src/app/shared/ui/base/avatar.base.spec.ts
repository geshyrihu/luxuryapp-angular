import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AvatarBase } from "./avatar.base";

@Component({ selector: "test-avatar", template: "" })
class TestAvatar extends AvatarBase {}

describe("AvatarBase", () => {
  function make() {
    TestBed.configureTestingModule({ imports: [TestAvatar] });
    return TestBed.createComponent(TestAvatar);
  }

  it("defaults circle / normal", () => {
    const c = make().componentInstance;
    expect(c.shape()).toBe("circle");
    expect(c.size()).toBe("normal");
    expect(c.sizePx()).toBe(32);
  });

  it("sizePx maps tokens", () => {
    const f = make();
    f.componentRef.setInput("size", "large");
    expect(f.componentInstance.sizePx()).toBe(48);
    f.componentRef.setInput("size", "xlarge");
    expect(f.componentInstance.sizePx()).toBe(64);
  });
});
