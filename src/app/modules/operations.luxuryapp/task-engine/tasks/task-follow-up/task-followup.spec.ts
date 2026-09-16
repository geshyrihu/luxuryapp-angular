import { NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { vi } from "vitest";
import { TaskFollowup } from "./task-followup";
import { TaskFollowUpEvidenceImage } from "../task-shared/interfaces/task-refactor.interface";

describe("TaskFollowup", () => {
  let component: TaskFollowup;
  let fixture: ComponentFixture<TaskFollowup>;
  let mockApiResponseS: any;
  let mockAspRoleS: any;
  let mockAuthS: any;
  let mockConfig: any;
  let mockRef: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetList: vi.fn().mockResolvedValue([]),
      onPost: vi.fn().mockResolvedValue(true),
      onPostFile: vi.fn().mockResolvedValue(true),
      onPatch: vi.fn().mockResolvedValue(true),
      onDelete: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn().mockReturnValue(true),
    };
    mockAspRoleS = { roleSignal: vi.fn().mockReturnValue(signal(false)) };
    mockAuthS = { applicationUserId: "user-001" };
    mockConfig = { data: { id: "ticket-123" } };
    mockRef = { close: vi.fn() };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskFollowup, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskFollowup],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AspRoleService, useValue: mockAspRoleS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskFollowup);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default signals", () => {
    expect(component.description()).toEqual([]);
    expect(component.submitting()).toBe(false);
    expect(component.loading()).toBe(false);
    expect(component.ticketMessageId).toBe("ticket-123");
  });

  it("should have form with expected controls", () => {
    expect(component.form.get("id")).not.toBeNull();
    expect(component.form.contains("ticketMessageId")).toBe(true);
    expect(component.form.contains("applicationUserId")).toBe(true);
    expect(component.form.contains("description")).toBe(true);
  });

  it("onCargaListaseguimientos should call api and set description", async () => {
    const mockData = [
      { id: "1", description: "Follow-up 1", createdAt: "2024-01-15 10:00" },
    ];
    mockApiResponseS.onGetList.mockResolvedValue(mockData);

    component.onCargaListaseguimientos();
    await new Promise((resolve) => setTimeout(resolve));

    expect(component.description()).toEqual(mockData);
  });

  it("onSubmit should call api and reload list", async () => {
    component.onSubmit();
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onPost).toHaveBeenCalled();
    expect(mockApiResponseS.onGetList).toHaveBeenCalled();
  });

  it("onDelete should call api and reload list", async () => {
    component.onDelete("followup-1");
    await new Promise((resolve) => setTimeout(resolve));

    expect(mockApiResponseS.onDelete).toHaveBeenCalled();
  });

  it("uploads evidence against follow-up id using File form field", async () => {
    const file = new File(["image"], "evidence.jpg", { type: "image/jpeg" });

    await component.onEvidenceSelect({ files: [file] }, "followup-1");

    const payload = mockApiResponseS.onPostFile.mock.calls[0][1] as FormData;
    expect((payload.get("File") as File).name).toBe(file.name);
    expect((payload.get("File") as File).type).toBe(file.type);
    expect(mockApiResponseS.onPostFile.mock.calls[0][0]).toContain(
      "task-follow-up/followup-1/evidence-images",
    );
  });

  it("reorders evidence with image ids", async () => {
    component.evidenceImages.set({
      "followup-1": [
        {
          id: "image-1",
          taskFollowUpId: "followup-1",
          fileName: "one.jpg",
          path: "/one.jpg",
          mimeType: "image/jpeg",
          sortOrder: 1,
          createdAt: "2026-01-01",
          createdByName: "User",
        } satisfies TaskFollowUpEvidenceImage,
        {
          id: "image-2",
          taskFollowUpId: "followup-1",
          fileName: "two.jpg",
          path: "/two.jpg",
          mimeType: "image/jpeg",
          sortOrder: 2,
          createdAt: "2026-01-01",
          createdByName: "User",
        } satisfies TaskFollowUpEvidenceImage,
      ],
    });

    await component.moveEvidence("followup-1", 1, -1);

    expect(mockApiResponseS.onPatch).toHaveBeenCalledWith(
      "task-follow-up/followup-1/evidence-images/reorder",
      { imageIds: ["image-2", "image-1"] },
    );
  });

  it("ngOnDestroy should close ref with data", () => {
    component.description.set([
      { id: "1", description: "Last", createdAt: "2024-01-15 10:00" },
    ]);
    component.ngOnDestroy();
    expect(mockRef.close).toHaveBeenCalledWith({
      count: 1,
      lastFollowUp: "Last",
      lastFollowUpDate: "2024-01-15",
    });
  });
});
