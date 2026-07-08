import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MobileCard } from './card';

describe('MobileCard', () => {
  let component: MobileCard;
  let fixture: ComponentFixture<MobileCard>;

  beforeEach(() => {
    TestBed.overrideComponent(MobileCard, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [MobileCard],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(MobileCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
