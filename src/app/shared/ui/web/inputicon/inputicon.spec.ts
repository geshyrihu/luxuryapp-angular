import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppInputIcon } from "./inputicon";

describe("AppInputIcon", () => {
  let component: AppInputIcon;
  let fixture: ComponentFixture<AppInputIcon>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AppInputIcon] });
    fixture = TestBed.createComponent(AppInputIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
