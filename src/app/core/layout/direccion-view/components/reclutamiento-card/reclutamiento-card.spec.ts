import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { vi } from "vitest";
import { ReclutamientoCard } from "./reclutamiento-card";

describe("ReclutamientoCard", () => {
  let component: ReclutamientoCard;
  let fixture: ComponentFixture<ReclutamientoCard>;

  const apiResponseServiceMock = {
    onGetItem: vi.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    TestBed.overrideComponent(ReclutamientoCard, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ReclutamientoCard],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
      ],
    });

    fixture = TestBed.createComponent(ReclutamientoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
