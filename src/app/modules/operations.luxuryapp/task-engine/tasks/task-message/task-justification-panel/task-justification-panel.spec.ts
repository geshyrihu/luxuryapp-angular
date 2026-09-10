import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { TaskJustificationInterface } from "src/app/core/interfaces/tasks/task-justification.interface";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { TaskJustificationPanel } from "./task-justification-panel";

describe("TaskJustificationPanel", () => {
  let fixture: ComponentFixture<TaskJustificationPanel>;
  let component: TaskJustificationPanel;

  const requestedJustification: TaskJustificationInterface = {
    id: "just-1",
    tasksId: "task-1",
    reason: "Motivo suficientemente detallado para justificar",
    requestedByUserId: "assignee-a",
    requestedByUserName: "Laura",
    approvedByUserId: null,
    approvedByUserName: null,
    state: 0,
    requestedAt: "2026-08-21",
    resolvedAt: null,
  };

  const approvedJustification: TaskJustificationInterface = {
    ...requestedJustification,
    state: 1,
    approvedByUserId: "boss-a",
    approvedByUserName: "María",
    resolvedAt: "2026-08-22",
  };

  const stateOptions: SelectItemDto<number>[] = [
    { value: 0, label: "Solicitada" },
    { value: 1, label: "Aprobada" },
    { value: 2, label: "Rechazada" },
  ];

  const apiResponseS = {
    onGetList: vi.fn(),
    onGetEnumSelectItem: vi.fn(),
    onPost: vi.fn(),
    onPatch: vi.fn(),
  };

  const authS = {
    applicationUserId: "assignee-a",
  };

  beforeEach(async () => {
    apiResponseS.onGetList.mockReset();
    apiResponseS.onGetEnumSelectItem.mockReset();
    apiResponseS.onPost.mockReset();
    apiResponseS.onPatch.mockReset();

    authS.applicationUserId = "assignee-a";
    apiResponseS.onGetList.mockResolvedValue([approvedJustification]);
    apiResponseS.onGetEnumSelectItem.mockResolvedValue(stateOptions);
    apiResponseS.onPost.mockResolvedValue({
      ...requestedJustification,
      id: "just-2",
    });
    apiResponseS.onPatch.mockResolvedValue(approvedJustification);

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TaskJustificationPanel],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseS },
        { provide: AuthService, useValue: authS },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskJustificationPanel);
    fixture.componentRef.setInput("tasksId", "task-1");
    fixture.componentRef.setInput("assigneeId", "assignee-a");
    component = fixture.componentInstance;
  });

  it("loads history and translates state using the enum catalog", async () => {
    await renderPanel();

    expect(apiResponseS.onGetList).toHaveBeenCalledWith(
      Endpoints.TaskJustifications.byTask("task-1"),
    );
    expect(apiResponseS.onGetEnumSelectItem).toHaveBeenCalledWith(
      Endpoints.SelectItems.taskJustificationState,
    );
    expect(component.stateLabel(1)).toBe("Aprobada");
    expect(fixture.nativeElement.textContent).toContain("Aprobada");
  });

  it("shows request form to the assignee and appends the created justification", async () => {
    apiResponseS.onGetList.mockResolvedValue([]);

    await renderPanel();
    component.newReason.set(" Motivo válido para solicitar justificación ");
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      "Solicitar justificación",
    );

    await component.onRequestJustification();

    expect(apiResponseS.onPost).toHaveBeenCalledWith(
      Endpoints.TaskJustifications.request,
      {
        tasksId: "task-1",
        reason: "Motivo válido para solicitar justificación",
      },
    );
    expect(component.justifications()).toContainEqual(
      expect.objectContaining({ id: "just-2" }),
    );
    expect(component.newReason()).toBe("");
  });

  it("does not post when reason has fewer than 20 characters", async () => {
    component.newReason.set("Muy corto");

    await component.onRequestJustification();

    expect(apiResponseS.onPost).not.toHaveBeenCalled();
  });

  it("hides request form from the assignee when a justification is pending", async () => {
    apiResponseS.onGetList.mockResolvedValue([requestedJustification]);

    await renderPanel();

    const textarea = fixture.debugElement.query(
      By.css("#task-justification-reason"),
    );

    expect(textarea).toBeNull();
  });

  it("lets a third party approve a pending justification and updates the local item", async () => {
    authS.applicationUserId = "boss-a";
    apiResponseS.onGetList.mockResolvedValue([requestedJustification]);

    await renderPanel();

    const approveButton = fixture.debugElement
      .queryAll(By.directive(WebButtonLabel))
      .find((button) => button.componentInstance.label() === "Aprobar");

    expect(approveButton).toBeTruthy();

    await component.onApprove("just-1");

    expect(apiResponseS.onPatch).toHaveBeenCalledWith(
      Endpoints.TaskJustifications.approve("just-1"),
      {},
    );
    expect(component.justifications()[0]).toEqual(
      expect.objectContaining({ state: 1, approvedByUserName: "María" }),
    );
  });

  it("does not show approve or reject buttons to the requester", async () => {
    apiResponseS.onGetList.mockResolvedValue([requestedJustification]);

    await renderPanel();

    expect(fixture.nativeElement.textContent).not.toContain("Aprobar");
    expect(fixture.nativeElement.textContent).not.toContain("Rechazar");
  });

  async function renderPanel() {
    fixture.detectChanges();
    await component.loadPanelData();
    fixture.detectChanges();
  }
});
