import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { TaskAttachmentInterface } from "src/app/core/interfaces/tasks/task-attachment.interface";
import { TaskChecklistItemInterface } from "src/app/core/interfaces/tasks/task-checklist-item.interface";
import { TaskChecklistPanel } from "./task-checklist-panel";

describe("TaskChecklistPanel", () => {
  let fixture: ComponentFixture<TaskChecklistPanel>;
  let component: TaskChecklistPanel;

  const checklistItem: TaskChecklistItemInterface = {
    id: "check-1",
    tasksId: "task-1",
    description: "Revisar bomba",
    isDone: false,
    doneByUserId: null,
    doneByUserName: null,
    doneAt: null,
  };

  const pdfAttachment: TaskAttachmentInterface = {
    id: "att-1",
    tasksId: "task-1",
    recurringTemplateId: "template-1",
    fileName: "comprobante.pdf",
    path: "/api/files/download?filePath=pdf",
    mimeType: "application/pdf",
    createdAt: "2026-08-21",
    createdByName: "Laura",
  };

  const imageAttachment: TaskAttachmentInterface = {
    id: "att-2",
    tasksId: "task-1",
    recurringTemplateId: "template-1",
    fileName: "foto.png",
    path: "/api/files/download?filePath=img",
    mimeType: "image/png",
    createdAt: "2026-08-21",
    createdByName: "Laura",
  };

  const apiResponseS = {
    onGetList: vi.fn(),
    onPatch: vi.fn(),
    onPost: vi.fn(),
    onDelete: vi.fn(),
    onPostFile: vi.fn(),
  };

  beforeEach(async () => {
    apiResponseS.onGetList.mockReset();
    apiResponseS.onPatch.mockReset();
    apiResponseS.onPost.mockReset();
    apiResponseS.onDelete.mockReset();
    apiResponseS.onPostFile.mockReset();

    apiResponseS.onGetList.mockImplementation((url: string) => {
      if (url === Endpoints.TaskChecklistItems.byTask("task-1")) {
        return Promise.resolve([checklistItem]);
      }

      if (url === Endpoints.TaskAttachments.byTask("task-1")) {
        return Promise.resolve([pdfAttachment, imageAttachment]);
      }

      return Promise.resolve([]);
    });
    apiResponseS.onPatch.mockResolvedValue({
      ...checklistItem,
      isDone: true,
      doneByUserId: "user-1",
      doneByUserName: "Laura",
      doneAt: "2026-08-21",
    });
    apiResponseS.onPost.mockResolvedValue({
      ...checklistItem,
      id: "check-2",
      description: "Tomar lectura",
    });
    apiResponseS.onDelete.mockResolvedValue(true);
    apiResponseS.onPostFile.mockResolvedValue({
      ...pdfAttachment,
      id: "att-3",
      fileName: "nuevo.pdf",
    });

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TaskChecklistPanel],
      providers: [
        { provide: ApiResponseService, useValue: apiResponseS },
        {
          provide: DialogHandlerService,
          useValue: {
            sizeFull: "full",
            openDialog: vi.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ConfirmService,
          useValue: { confirm: vi.fn().mockResolvedValue(true) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskChecklistPanel);
    fixture.componentRef.setInput("tasksId", "task-1");
    component = fixture.componentInstance;
  });

  it("loads checklist items and attachments for the task", async () => {
    await component.loadPanelData();

    expect(apiResponseS.onGetList).toHaveBeenCalledWith(
      Endpoints.TaskChecklistItems.byTask("task-1"),
    );
    expect(apiResponseS.onGetList).toHaveBeenCalledWith(
      Endpoints.TaskAttachments.byTask("task-1"),
    );
    expect(component.checklistItems()).toEqual([checklistItem]);
    expect(component.attachments()).toEqual([pdfAttachment, imageAttachment]);
  });

  it("adds a checklist item and clears the local input", async () => {
    component.newDescription.set(" Tomar lectura ");

    await component.onAddChecklistItem();

    expect(apiResponseS.onPost).toHaveBeenCalledWith(
      Endpoints.TaskChecklistItems.base,
      {
        tasksId: "task-1",
        description: "Tomar lectura",
      },
    );
    expect(component.checklistItems()).toContainEqual(
      expect.objectContaining({ id: "check-2", description: "Tomar lectura" }),
    );
    expect(component.newDescription()).toBe("");
  });

  it("toggles an item using PATCH and updates only the local item", async () => {
    component.checklistItems.set([checklistItem]);

    await component.onToggleDone(checklistItem);

    expect(apiResponseS.onPatch).toHaveBeenCalledWith(
      Endpoints.TaskChecklistItems.toggleDone("check-1"),
      {},
    );
    expect(component.checklistItems()[0]).toEqual(
      expect.objectContaining({ id: "check-1", isDone: true }),
    );
  });

  it("removes checklist items and attachments after a successful delete", async () => {
    component.checklistItems.set([checklistItem]);
    component.attachments.set([pdfAttachment]);

    await component.onDeleteChecklistItem("check-1");
    await component.onDeleteAttachment("att-1");

    expect(apiResponseS.onDelete).toHaveBeenCalledWith(
      Endpoints.TaskChecklistItems.delete("check-1"),
    );
    expect(apiResponseS.onDelete).toHaveBeenCalledWith(
      Endpoints.TaskAttachments.delete("att-1"),
    );
    expect(component.checklistItems()).toEqual([]);
    expect(component.attachments()).toEqual([]);
  });

  it("uploads attachments as multipart using backend DTO property names", async () => {
    const file = new File(["pdf"], "nuevo.pdf", { type: "application/pdf" });
    const input = document.createElement("input");
    Object.defineProperty(input, "files", { value: [file] });

    await component.onFileSelected({ target: input } as unknown as Event);

    const formData = apiResponseS.onPostFile.mock.calls[0][1] as FormData;
    expect(apiResponseS.onPostFile).toHaveBeenCalledWith(
      Endpoints.TaskAttachments.upload,
      expect.any(FormData),
    );
    expect(formData.get("TasksId")).toBe("task-1");
    expect(formData.get("File")).toBe(file);
    expect(component.attachments()).toContainEqual(
      expect.objectContaining({ id: "att-3", fileName: "nuevo.pdf" }),
    );
  });

  it("renders PDF attachments with fileName and images as thumbnails", async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.isLoading.set(false);
    component.attachments.set([pdfAttachment, imageAttachment]);
    fixture.detectChanges();

    const pdfButton = fixture.debugElement.query(By.css("iw-button-view-pdf"))
      .componentInstance as WebButtonIconViewPdf;
    const image = fixture.nativeElement.querySelector("img");

    expect(pdfButton.url()).toBe(pdfAttachment.path);
    expect(pdfButton.fileName()).toBe(pdfAttachment.fileName);
    expect(image.getAttribute("src")).toBe(imageAttachment.path);
    expect(image.getAttribute("alt")).toBe(imageAttachment.fileName);
  });
});
