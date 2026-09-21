import { TestBed } from "@angular/core/testing";
import { UpdateService } from "./update-pwa.service";
import { SwUpdate } from "@angular/service-worker";
import { Subject } from "rxjs";

describe("UpdateService", () => {
  let service: UpdateService;
  let versionUpdates: Subject<{ type: string }>;
  let swUpdate: {
    isEnabled: boolean;
    versionUpdates: Subject<{ type: string }>;
    checkForUpdate: ReturnType<typeof vi.fn>;
    activateUpdate: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    versionUpdates = new Subject();
    swUpdate = {
      isEnabled: true,
      versionUpdates,
      checkForUpdate: vi.fn().mockResolvedValue(false),
      activateUpdate: vi.fn().mockRejectedValue(new Error("activation failed")),
    };

    TestBed.configureTestingModule({
      providers: [UpdateService, { provide: SwUpdate, useValue: swUpdate }],
    });
    service = TestBed.inject(UpdateService);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

  it("notifies only once for repeated VERSION_READY events", () => {
    const updates: boolean[] = [];
    service.updateAvailable$.subscribe((available) => updates.push(available));

    versionUpdates.next({ type: "VERSION_READY" });
    versionUpdates.next({ type: "VERSION_READY" });

    expect(updates).toEqual([false, true]);
  });

  it("returns false and clears availability when activation fails", async () => {
    versionUpdates.next({ type: "VERSION_READY" });

    const activated = await service.activateUpdate();

    expect(activated).toBe(false);
    expect(swUpdate.activateUpdate).toHaveBeenCalledOnce();
    expect(service.isUpdateAvailable()).toBe(false);
  });
});
