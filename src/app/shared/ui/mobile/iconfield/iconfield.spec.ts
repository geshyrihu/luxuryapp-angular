import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MobileIconField } from "./iconfield";

describe("MobileIconField", () => {
  let component: MobileIconField;
  let fixture: ComponentFixture<MobileIconField>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MobileIconField] });
    fixture = TestBed.createComponent(MobileIconField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
