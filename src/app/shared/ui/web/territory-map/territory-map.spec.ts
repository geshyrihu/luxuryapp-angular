import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppTerritoryMap } from './territory-map';

describe('AppTerritoryMap', () => {
  let component: AppTerritoryMap;
  let fixture: ComponentFixture<AppTerritoryMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTerritoryMap],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTerritoryMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
