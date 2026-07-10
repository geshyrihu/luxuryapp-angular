import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { vi } from "vitest";
import { CustomerHeaderDataCommittee } from "./customer-header-data-committee";

describe("CustomerHeaderDataCommittee", () => {
  let component: CustomerHeaderDataCommittee;
  let fixture: ComponentFixture<CustomerHeaderDataCommittee>;
  let customerIdServiceMock: any;

  beforeEach(() => {
    customerIdServiceMock = {
      nombreCorto: vi.fn().mockReturnValue("Test Customer"),
      customerPhotoPath: vi.fn().mockReturnValue("photo.jpg"),
      customerId: vi.fn().mockReturnValue("123"),
      setCustomerId: vi.fn().mockReturnValue(of(true)),
    };

    TestBed.overrideComponent(CustomerHeaderDataCommittee, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomerHeaderDataCommittee],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CustomerIdService, useValue: customerIdServiceMock },
      ],
    });

    fixture = TestBed.createComponent(CustomerHeaderDataCommittee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should inject customerIdService", () => {
    expect(component.customerIdS).toBeDefined();
  });
});
