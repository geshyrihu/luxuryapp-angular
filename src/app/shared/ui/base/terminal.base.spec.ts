import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TerminalBase } from "./terminal.base";

@Component({ selector: "test-terminal", template: "" })
class Host extends TerminalBase {}

describe("TerminalBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
