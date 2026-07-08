import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxInputGroup } from './input-group';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxInputGroup', () => {
  let component: LxInputGroup;
  let fixture: ComponentFixture<LxInputGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxInputGroup],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxInputGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
