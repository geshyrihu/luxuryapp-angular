import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxCascadeSelect } from './cascade-select';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxCascadeSelect', () => {
  let component: LxCascadeSelect;
  let fixture: ComponentFixture<LxCascadeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxCascadeSelect],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxCascadeSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
