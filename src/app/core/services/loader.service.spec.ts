import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService],
    });
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loading state false', () => {
    expect(service.loading$()).toBe(false);
  });

  it('show() should set loading to true', () => {
    service.show();
    expect(service.loading$()).toBe(true);
  });

  it('hide() should set loading to false', () => {
    service.show();
    service.hide();
    expect(service.loading$()).toBe(false);
  });

  it('should toggle loading state correctly', () => {
    service.show();
    expect(service.loading$()).toBe(true);
    service.show();
    expect(service.loading$()).toBe(true);
    service.hide();
    expect(service.loading$()).toBe(false);
  });
});
