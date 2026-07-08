import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MobileLoader } from './mobile-loader';
import { LoaderService } from 'src/app/core/services/loader.service';
import { vi } from 'vitest';

describe('MobileLoader', () => {
  let component: MobileLoader;
  let fixture: ComponentFixture<MobileLoader>;

  beforeEach(() => {
    TestBed.overrideComponent(MobileLoader, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MobileLoader],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: LoaderService, useValue: { loading$: vi.fn(() => false) } },
      ],
    });
    fixture = TestBed.createComponent(MobileLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
