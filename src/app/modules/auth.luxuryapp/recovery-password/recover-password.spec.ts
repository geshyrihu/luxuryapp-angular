import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { LoginSliderService } from "src/app/core/auth/services/login-slider.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { vi } from "vitest";
import { RecoverPassword } from "./recover-password";

describe("RecoverPassword", () => {
  let component: RecoverPassword;
  let fixture: ComponentFixture<RecoverPassword>;

  beforeEach(() => {
    TestBed.overrideComponent(RecoverPassword, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [RecoverPassword],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: { validateForm: vi.fn() } },
        { provide: DataConnectorService, useValue: { post: vi.fn() } },
        {
          provide: LoginSliderService,
          useValue: { getVisibleImages$: () => of([]) },
        },
      ],
    });

    fixture = TestBed.createComponent(RecoverPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.submitting()).toBe(false);
    expect(component.errorMessage()).toBe("");
    expect(component.successMessage()).toBe("");
    expect(component.countdown()).toBe(0);
  });

  it("should initialize form with empty email", () => {
    expect(component.form.get("email")?.value).toBe("");
  });
});
