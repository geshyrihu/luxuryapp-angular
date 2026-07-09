import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MobileInputIcon } from "./inputicon";

describe("MobileInputIcon", () => {
  let component: MobileInputIcon;
  let fixture: ComponentFixture<MobileInputIcon>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MobileInputIcon] });
    fixture = TestBed.createComponent(MobileInputIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
