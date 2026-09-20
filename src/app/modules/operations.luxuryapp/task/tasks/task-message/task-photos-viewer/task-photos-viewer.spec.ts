import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { vi } from "vitest";
import { TaskPhotosViewer } from "./task-photos-viewer";

describe("TaskPhotosViewer", () => {
  let component: TaskPhotosViewer;
  let fixture: ComponentFixture<TaskPhotosViewer>;
  let mockApiS: any;

  const setup = (data: any) => {
    mockApiS = { onGetList: vi.fn().mockResolvedValue([]) };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(TaskPhotosViewer, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [TaskPhotosViewer],
      providers: [
        { provide: ApiResponseService, useValue: mockApiS },
        { provide: DynamicDialogConfig, useValue: { data } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(TaskPhotosViewer);
    component = fixture.componentInstance;
  };

  it("should load additional images in additional mode", async () => {
    setup({ taskId: "t1", mode: "additional" });
    mockApiS.onGetList.mockResolvedValue([
      { id: "i1", path: "p1", fileName: "f1" },
    ]);

    await component.ngOnInit();

    expect(mockApiS.onGetList).toHaveBeenCalledWith(
      "tasks/t1/additional-images",
    );
    expect(component.additionalImages().length).toBe(1);
  });

  it("should not call the api in before-after mode", async () => {
    setup({
      taskId: "t1",
      mode: "before-after",
      beforeWork: "before.png",
      afterWork: "after.png",
    });

    await component.ngOnInit();

    expect(mockApiS.onGetList).not.toHaveBeenCalled();
    expect(component.beforeWork).toBe("before.png");
    expect(component.afterWork).toBe("after.png");
  });
});
