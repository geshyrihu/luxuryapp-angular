import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileProfileCard } from './profile-card';

describe('MobileProfileCard', () => {
  let component: MobileProfileCard;
  let fixture: ComponentFixture<MobileProfileCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileProfileCard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileProfileCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
