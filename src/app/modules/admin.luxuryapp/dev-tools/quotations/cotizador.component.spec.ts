import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CotizadorComponent } from './cotizador.component';

describe('CotizadorComponent', () => {
  let component: CotizadorComponent;
  let fixture: ComponentFixture<CotizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotizadorComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CotizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with 6 modules', () => {
    expect(component.modules().length).toBe(6);
  });

  it('should initialize with 1 department', () => {
    expect(component.departmentsCount()).toBe(1);
  });

  it('should have zero totalPrice when no modules selected', () => {
    expect(component.totalPrice()).toBe(0);
  });

  it('should calculate selectedModulesPrice correctly', () => {
    component.toggleModule(component.modules()[0], true);
    expect(component.selectedModulesPrice()).toBe(50);
  });

  it('should calculate departmentsPrice when modules selected', () => {
    component.toggleModule(component.modules()[0], true);
    expect(component.departmentsPrice()).toBe(1.5);
  });

  it('should calculate totalPrice combining modules and departments', () => {
    component.toggleModule(component.modules()[0], true);
    component.toggleModule(component.modules()[1], true);
    expect(component.totalPrice()).toBe(111.5);
  });

  it('should toggle module selection', () => {
    component.toggleModule(component.modules()[0], true);
    expect(component.modules()[0].selected).toBe(true);

    component.toggleModule(component.modules()[0], false);
    expect(component.modules()[0].selected).toBe(false);
  });

  it('should update departmentsCount', () => {
    component.updateDepartments(5);
    expect(component.departmentsCount()).toBe(5);
  });

  it('should not allow departmentsCount below 1', () => {
    component.updateDepartments(0);
    expect(component.departmentsCount()).toBe(1);

    component.updateDepartments(-3);
    expect(component.departmentsCount()).toBe(1);
  });

  it('should set departmentsCount to 1 when null/undefined', () => {
    component.updateDepartments(null as any);
    expect(component.departmentsCount()).toBe(1);

    component.updateDepartments(undefined as any);
    expect(component.departmentsCount()).toBe(1);
  });
});
