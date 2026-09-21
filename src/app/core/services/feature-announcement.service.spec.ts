import { TestBed } from "@angular/core/testing";
import { FeatureAnnouncementService } from "./feature-announcement.service";

describe("FeatureAnnouncementService", () => {
  let service: FeatureAnnouncementService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [FeatureAnnouncementService],
    });
    service = TestBed.inject(FeatureAnnouncementService);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

  it("shows announcement when current version was not seen", () => {
    service.checkForUpdates();

    expect(service.showDialog()).toBe(true);
  });

  it("does not show announcement after current version is marked as seen", () => {
    service.markAsSeen();
    service.checkForUpdates();

    expect(service.showDialog()).toBe(false);
  });
});
