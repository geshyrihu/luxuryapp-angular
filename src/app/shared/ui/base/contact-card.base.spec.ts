import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ContactCardBase } from "./contact-card.base";

@Component({ selector: "test-contact-card", template: "" })
class Host extends ContactCardBase {}

describe("ContactCardBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
