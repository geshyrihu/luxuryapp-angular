import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MobilePopover } from "./popover";

describe("MobilePopover", () => {
  let component: MobilePopover;
  let fixture: ComponentFixture<MobilePopover>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MobilePopover] });
    fixture = TestBed.createComponent(MobilePopover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
