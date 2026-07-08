import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileContactCard } from './contact-card';

describe('MobileContactCard', () => {
  let component: MobileContactCard;
  let fixture: ComponentFixture<MobileContactCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileContactCard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileContactCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
