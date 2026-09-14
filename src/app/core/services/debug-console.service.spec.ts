import { TestBed } from '@angular/core/testing';
import { DebugConsoleService } from './debug-console.service';

describe('DebugConsoleService', () => {
  let service: DebugConsoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebugConsoleService],
    });
    service = TestBed.inject(DebugConsoleService);
  });

  afterEach(() => {
    service.clearLogs();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle console visibility', () => {
    expect(service.showConsole()).toBe(false);
    service.toggleConsole();
    expect(service.showConsole()).toBe(true);
    service.toggleConsole();
    expect(service.showConsole()).toBe(false);
  });

  it('should clear logs', () => {
    service.clearLogs();
    expect(service.logs().length).toBe(0);
  });
});
