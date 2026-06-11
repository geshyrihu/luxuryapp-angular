import { TestBed } from '@angular/core/testing';
import { HidescrollnavService } from './hidescrollnav.service';

describe('HidescrollnavService', () => {
  let service: HidescrollnavService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HidescrollnavService],
    });
    service = TestBed.inject(HidescrollnavService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
