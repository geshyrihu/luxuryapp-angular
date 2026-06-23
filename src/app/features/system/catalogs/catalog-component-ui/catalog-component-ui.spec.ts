import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CatalogComponentUi } from './catalog-component-ui';

describe('CatalogComponentUi', () => {
  let component: CatalogComponentUi;
  let fixture: ComponentFixture<CatalogComponentUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogComponentUi],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: { add: vi.fn(), clear: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogComponentUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start on tokens category', () => {
    expect(component.activeCategory()).toBe('tokens');
  });

  it('should toggle sidebar', () => {
    expect(component.sidebarCollapsed()).toBe(false);
    component.toggleSidebar();
    expect(component.sidebarCollapsed()).toBe(true);
  });

  it('should navigate to category', () => {
    component.navigateTo('web');
    expect(component.activeCategory()).toBe('web');
  });

  it('should mock login with empty fields', () => {
    component.loginForm.email = '';
    component.loginForm.password = '';
    component.mockLogin();
    expect(component.loginMessage()).toContain('Completa ambos campos');
  });

  it('should mock login successfully', () => {
    component.loginForm.email = 'test@luxuryapp.com';
    component.loginForm.password = '123456';
    component.mockLogin();
    expect(component.loginMessage()).toContain('exitoso');
  });
});
