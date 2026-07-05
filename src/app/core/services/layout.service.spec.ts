import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default customize empty string', () => {
    expect(service.customize).toBe('');
  });

  it('should have default margin 0', () => {
    expect(service.margin).toBe(0);
  });

  it('should have default config settings', () => {
    expect(service.config.settings.layout_type).toBe('ltr');
    expect(service.config.settings.layout_version).toBe('dark-sidebar');
    expect(service.config.settings.sidebar_type).toBe('compact-wrapper');
    expect(service.config.settings.icon).toBe('mdi:draw-pen');
  });

  it('should have default color config', () => {
    expect(service.config.color.primary_color).toBe('#6f5a99');
    expect(service.config.color.secondary_color).toBe('#e24175');
  });

  it('should allow setting customize', () => {
    service.customize = 'custom-class';
    expect(service.customize).toBe('custom-class');
  });

  it('should allow setting margin', () => {
    service.margin = 10;
    expect(service.margin).toBe(10);
  });
});
