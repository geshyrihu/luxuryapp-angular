import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxEmptyState } from './empty-state';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxEmptyState', () => {
  let component: LxEmptyState;
  let fixture: ComponentFixture<LxEmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxEmptyState],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxEmptyState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
