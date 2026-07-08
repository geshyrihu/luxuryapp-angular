import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxContactCard } from './contact-card';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxContactCard', () => {
  let component: LxContactCard;
  let fixture: ComponentFixture<LxContactCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxContactCard],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxContactCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
