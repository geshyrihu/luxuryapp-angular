import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppLoader } from './loader';
import { LoaderService } from 'src/app/core/services/loader.service';
import { vi } from 'vitest';

describe('AppLoader', () => {
  let component: AppLoader;
  let fixture: ComponentFixture<AppLoader>;

  beforeEach(() => {
    TestBed.overrideComponent(AppLoader, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [AppLoader],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: LoaderService,
          useValue: { loading$: vi.fn(() => false) },
        },
      ],
    });
    fixture = TestBed.createComponent(AppLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
