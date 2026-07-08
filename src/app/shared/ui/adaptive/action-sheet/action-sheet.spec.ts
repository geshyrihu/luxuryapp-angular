import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxActionSheet } from './action-sheet';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxActionSheet', () => {
  let component: LxActionSheet;
  let fixture: ComponentFixture<LxActionSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxActionSheet],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxActionSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
