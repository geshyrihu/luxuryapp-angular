import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, provideRouter } from "@angular/router";
import { of } from "rxjs";
import { LoginSliderService } from "src/app/core/auth/services/login-slider.service";
import { DataConnectorService } from "src/app/core/services/data-connector.service";
import { vi } from "vitest";
import { ResetPassword } from "./reset-password";

describe("ResetPassword", () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;

  beforeEach(() => {
    TestBed.overrideComponent(ResetPassword, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ResetPassword],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideRouter([]),
        { provide: DataConnectorService, useValue: { post: vi.fn() } },
        {
          provide: LoginSliderService,
          useValue: { getVisibleImages$: () => of([]) },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => {
                  if (key === "token") return "valid-token";
                  if (key === "email") return "test@test.com";
                  return null;
                },
              },
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signal values", () => {
    expect(component.submitting()).toBe(false);
    expect(component.errorMessage()).toBe("");
  });

  it("should read token and email from query params on init", () => {
    expect(component.token()).toBe("valid-token");
    expect(component.email()).toBe("test@test.com");
  });

  it("should initialize form with empty passwords", () => {
    expect(component.form.get("newPassword")?.value).toBe("");
    expect(component.form.get("confirmPassword")?.value).toBe("");
  });
});
