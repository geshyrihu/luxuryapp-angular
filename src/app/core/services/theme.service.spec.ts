import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.body.classList.remove('theme-dark', 'theme-light');

    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [ThemeService] });
    service = TestBed.inject(ThemeService);

    expect(service.themeMode()).toBe('dark');
  });

  it('should default to light when no preference saved', () => {
    expect(service.themeMode()).toBe('light');
  });

  describe('setTheme', () => {
    it('should set theme mode to dark', () => {
      service.setTheme('dark');
      expect(service.themeMode()).toBe('dark');
    });

    it('should persist theme to localStorage', () => {
      service.setTheme('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should set theme mode to light', () => {
      service.setTheme('light');
      expect(service.themeMode()).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      service.themeMode.set('light');
      service.toggleTheme();
      expect(service.themeMode()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      service.themeMode.set('dark');
      service.toggleTheme();
      expect(service.themeMode()).toBe('light');
    });
  });

  describe('getCurrentTheme', () => {
    it('should return current theme mode', () => {
      expect(service.getCurrentTheme()).toBe(service.themeMode());
    });
  });

  describe('isDarkMode', () => {
    it('should return true when theme is dark', () => {
      service.setTheme('dark');
      expect(service.isDarkMode()).toBe(true);
    });

    it('should return false when theme is light', () => {
      service.setTheme('light');
      expect(service.isDarkMode()).toBe(false);
    });
  });

  it('should apply theme data-theme attribute via constructor', () => {
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.body.getAttribute('data-theme')).toBe('light');
  });

  it('should persist to localStorage on setTheme', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(service.themeMode()).toBe('dark');
  });
});
