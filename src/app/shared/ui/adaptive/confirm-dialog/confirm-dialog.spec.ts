import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxConfirmDialog } from './confirm-dialog';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxConfirmDialog', () => {
  let component: LxConfirmDialog;
  let fixture: ComponentFixture<LxConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxConfirmDialog],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
