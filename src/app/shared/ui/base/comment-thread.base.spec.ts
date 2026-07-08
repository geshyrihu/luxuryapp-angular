import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { CommentThreadBase } from "./comment-thread.base";

@Component({ selector: "test-comment-thread", standalone: true, template: "" })
class Host extends CommentThreadBase {}

describe("CommentThreadBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
