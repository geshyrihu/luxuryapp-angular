import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxConfirmPopup } from './confirm-popup';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxConfirmPopup', () => {
  let component: LxConfirmPopup;
  let fixture: ComponentFixture<LxConfirmPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxConfirmPopup],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxConfirmPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
