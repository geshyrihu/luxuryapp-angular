import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { vi } from "vitest";
import { ContratosCard } from "./contratos-card";

describe("ContratosCard", () => {
  let component: ContratosCard;
  let fixture: ComponentFixture<ContratosCard>;

  const apiResponseServiceMock = {
    onGetItem: vi.fn().mockResolvedValue(null),
  };

  const dialogHandlerServiceMock = {
    openDialog: vi.fn(),
  };

  beforeEach(() => {
    TestBed.overrideComponent(ContratosCard, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ContratosCard],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: DialogHandlerService, useValue: dialogHandlerServiceMock },
      ],
    });

    fixture = TestBed.createComponent(ContratosCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
