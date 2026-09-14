import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService],
    });
    service = TestBed.inject(MessageService);
  });

  afterEach(() => {
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a message', () => {
    service.add({ severity: 'info', summary: 'Test', detail: 'Detail' });
    expect(service.messages().length).toBe(1);
    expect(service.messages()[0].severity).toBe('info');
  });

  it('should clear all messages', () => {
    service.add({ severity: 'warn', summary: 'A' });
    service.add({ severity: 'error', summary: 'B' });
    service.clear();
    expect(service.messages().length).toBe(0);
  });

  it('should clear messages by key', () => {
    service.add({ key: 'group1', severity: 'info', summary: 'A' });
    service.add({ key: 'group2', severity: 'warn', summary: 'B' });
    service.clear('group1');
    expect(service.messages().length).toBe(1);
    expect(service.messages()[0].key).toBe('group2');
  });
});
