import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LxDebugConsole } from "./debug-console";

describe("LxDebugConsole", () => {
  let component: LxDebugConsole;
  let fixture: ComponentFixture<LxDebugConsole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxDebugConsole],
    }).compileComponents();

    fixture = TestBed.createComponent(LxDebugConsole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
