import { TestBed } from "@angular/core/testing";
import { ApprovalWorkflow } from "../../primitives/approval-workflow/approval-workflow";

describe("ApprovalWorkflow", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [ApprovalWorkflow] });
    expect(TestBed.createComponent(ApprovalWorkflow).componentInstance).toBeTruthy();
  });
});
