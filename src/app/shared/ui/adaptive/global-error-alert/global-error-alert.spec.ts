import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxGlobalErrorAlert } from './global-error-alert';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxGlobalErrorAlert', () => {
  let component: LxGlobalErrorAlert;
  let fixture: ComponentFixture<LxGlobalErrorAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxGlobalErrorAlert],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxGlobalErrorAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
