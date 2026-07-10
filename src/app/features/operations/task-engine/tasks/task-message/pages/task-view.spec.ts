import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { vi } from "vitest";
import { TaskView } from "./task-view";

describe("TaskView", () => {
  let component: TaskView;
  let fixture: ComponentFixture<TaskView>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockCustomerIdS: any;
  let mockDialogHandlerS: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetItem: vi.fn().mockResolvedValue({ id: "1", title: "Test Ticket" }),
    };
    mockAuthS = { applicationUserId: "user-001" };
    mockCustomerIdS = { customerId: vi.fn().mockReturnValue("cust-001") };
    mockDialogHandlerS = {
      openDialog: vi.fn().mockResolvedValue(true),
      sizeLg: "1200px",
    };
    mockActivatedRoute = { params: { subscribe: vi.fn() } };
    mockRouter = { navigate: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskView, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskView],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: CustomerIdService, useValue: mockCustomerIdS },
        { provide: DialogHandlerService, useValue: mockDialogHandlerS },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskView);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.submitting()).toBe(false);
    expect(component.notTicket()).toBe(false);
    expect(component.ticket()).toBeNull();
    expect(component.applicationUserId).toBe("user-001");
  });

  it("onLoadData should call api and set ticket", async () => {
    const mockTicket = { id: "1", title: "Test" };
    mockApiResponseS.onGetItem.mockResolvedValue(mockTicket);

    component.id = "1";
    component.onLoadData();
    await new Promise((resolve) => setTimeout(resolve));
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
    expect(component.ticket()).toBe(mockTicket);
  });

  it("goBack should navigate back", () => {
    component.ticketGroupId = "group-1";
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/Tasks/messages",
      "group-1",
    ]);
  });
});
