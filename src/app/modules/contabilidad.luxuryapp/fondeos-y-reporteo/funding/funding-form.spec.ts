import { IonicMocks } from "src/app/core/testing/ionic-mocks";

vi.mock("@ionic/angular/standalone", () => ({ ...IonicMocks }));
vi.mock("@ionic/core", () => ({}));
vi.mock("@ionic/core/components", () => ({}));
vi.mock("@ui/web/pdf-viewer-modal/pdf-viewer-modal", () => ({
  PdfViewerModal: class {},
}));

import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subject } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { FundingForm } from "./funding-form";

describe("FundingForm", () => {
  let component: FundingForm;
  let fixture: ComponentFixture<FundingForm>;
  let mockApiResponseS: any;
  let mockSignalRS: any;
  let mockConfig: any;
  let mockCustomerIdS: any;
  let mockRef: any;
  let messageSubject: Subject<any>;

  beforeEach(async () => {
    messageSubject = new Subject<any>();
    mockApiResponseS = {
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn(),
      onPost: vi.fn(),
      validateForm: vi.fn(() => true),
    };
    mockSignalRS = { messageReceived$: messageSubject.asObservable() };
    mockConfig = { data: {} };
    mockCustomerIdS = { customerId: vi.fn(() => "cust-123") };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [FundingForm],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: SignalRService, useValue: mockSignalRS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(FundingForm);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load existing data on init when id is provided", () => {
    mockConfig.data = { id: "fnd-001" };
    mockApiResponseS.onGetSelectItem.mockResolvedValue([]);
    mockApiResponseS.onGetItem.mockResolvedValue({ period: "2024-01" });

    fixture = TestBed.createComponent(FundingForm);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith(
      Endpoints.Funding.getById("fnd-001"),
    );
    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalled();
  });

  it("should not load data on init when id is empty", () => {
    mockApiResponseS.onGetSelectItem.mockResolvedValue([]);

    fixture = TestBed.createComponent(FundingForm);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(mockApiResponseS.onGetItem).not.toHaveBeenCalled();
    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalled();
  });

  it("should reload data when SignalR message is received", () => {
    mockApiResponseS.onGetItem.mockResolvedValue({});
    component.id = "fnd-001";

    messageSubject.next("refresh");

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith(
      Endpoints.Funding.getById("fnd-001"),
    );
  });

  it("should submit and close dialog on valid form", async () => {
    mockApiResponseS.onPost.mockResolvedValue(true);
    component.form.patchValue({ period: "2024-01" });

    component.onSubmit();

    expect(mockApiResponseS.validateForm).toHaveBeenCalled();
    expect(mockApiResponseS.onPost).toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve));
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });

  it("should not close dialog on submit when API returns false", async () => {
    mockApiResponseS.onPost.mockResolvedValue(false);
    component.form.patchValue({ period: "2024-01" });

    component.onSubmit();
    await vi.waitFor(() => expect(component.submitting()).toBe(false));

    expect(mockRef.close).not.toHaveBeenCalled();
  });
});
