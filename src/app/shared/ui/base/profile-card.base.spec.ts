import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ProfileCardBase } from "./profile-card.base";

@Component({ selector: "test-profile-card", template: "" })
class Host extends ProfileCardBase {}

describe("ProfileCardBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
