import { TestBed } from '@angular/core/testing';
import { ConventionsService } from './conventions-viewer.service';

describe('ConventionsService', () => {
  let service: ConventionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConventionsService],
    });
    service = TestBed.inject(ConventionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return conventions', () => {
    service.getConventions().subscribe((conventions) => {
      expect(conventions.length).toBeGreaterThan(0);
    });
  });

  it('should search conventions', () => {
    service.searchConventions('backend').subscribe((conventions) => {
      expect(conventions.length).toBeGreaterThan(0);
    });
  });
});
