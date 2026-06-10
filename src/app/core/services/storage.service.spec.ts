import { TestBed } from '@angular/core/testing';
import { ConsoleLoggerService } from './console-logger.service';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        {
          provide: ConsoleLoggerService,
          useValue: { custom: vi.fn() },
        },
      ],
    });

    service = TestBed.inject(StorageService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('store', () => {
    it('should store a value as JSON string', () => {
      service.store('testKey', { name: 'test' });
      expect(localStorage.getItem('testKey')).toBe('{"name":"test"}');
    });

    it('should store primitive values', () => {
      service.store('numberKey', 42);
      expect(localStorage.getItem('numberKey')).toBe('42');
    });
  });

  describe('retrieve', () => {
    it('should return parsed value when key exists', () => {
      localStorage.setItem('testKey', '{"name":"test"}');
      const result = service.retrieve('testKey');
      expect(result).toEqual({ name: 'test' });
    });

    it('should return undefined when key does not exist', () => {
      const result = service.retrieve('nonExistent');
      expect(result).toBeUndefined();
    });

    it('should return undefined when item is literal "undefined"', () => {
      localStorage.setItem('badKey', 'undefined');
      const result = service.retrieve('badKey');
      expect(result).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove the key from localStorage', () => {
      localStorage.setItem('testKey', 'value');
      service.remove('testKey');
      expect(localStorage.getItem('testKey')).toBeNull();
    });
  });

  describe('clear', () => {
    it('should remove a specific key when key is provided', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      service.clear('key1');
      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBe('value2');
    });

    it('should clear all localStorage when no key is provided', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      service.clear();
      expect(localStorage.length).toBe(0);
    });
  });

  it('should store and retrieve complex objects', () => {
    const obj = { id: 1, name: 'test', nested: { arr: [1, 2, 3] } };
    service.store('complex', obj);
    const retrieved = service.retrieve('complex');
    expect(retrieved).toEqual(obj);
  });
});
