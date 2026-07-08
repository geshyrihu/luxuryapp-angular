import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ErrorBoundary } from './error-boundary';
import { GlobalErrorService } from 'src/app/core/services/global-error-handler.service';

describe('ErrorBoundary', () => {
  let component: ErrorBoundary;
  let fixture: ComponentFixture<ErrorBoundary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorBoundary],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: GlobalErrorService,
          useValue: {
            lastError: { subscribe: () => {} },
            markHandled: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorBoundary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
