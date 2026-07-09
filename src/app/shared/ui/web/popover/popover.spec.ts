import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppPopover } from "./popover";

describe("AppPopover", () => {
  let component: AppPopover;
  let fixture: ComponentFixture<AppPopover>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AppPopover] });
    fixture = TestBed.createComponent(AppPopover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
