import { TestBed } from '@angular/core/testing';
import { FeatureAnnouncementService } from './feature-announcement.service';

describe('FeatureAnnouncementService', () => {
  let service: FeatureAnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureAnnouncementService],
    });
    service = TestBed.inject(FeatureAnnouncementService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
