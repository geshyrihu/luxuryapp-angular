import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppProfileCard } from './profile-card';

describe('AppProfileCard', () => {
  let component: AppProfileCard;
  let fixture: ComponentFixture<AppProfileCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppProfileCard],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppProfileCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
