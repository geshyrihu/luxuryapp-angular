import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import { ProductosForm } from './productos-form';

describe('ProductosForm', () => {
  let component: ProductosForm;
  let fixture: ComponentFixture<ProductosForm>;
  let mockApiResponseS: any;
  let mockAuthS: any;
  let mockConfig: any;
  let mockRef: any;
  let mockEnumSelectS: any;

  beforeEach(() => {
    mockApiResponseS = {
      onGetSelectItem: vi.fn().mockResolvedValue([]),
      onGetItem: vi.fn().mockResolvedValue(null),
      onPost: vi.fn().mockResolvedValue(true),
      onPut: vi.fn().mockResolvedValue(true),
      validateForm: vi.fn().mockReturnValue(true),
    };
    mockAuthS = { applicationUserId: 'user-789' };
    mockConfig = { data: {} };
    mockRef = { close: vi.fn() };
    mockEnumSelectS = {
      productClasificacion: vi.fn().mockReturnValue(of([])),
    };

    TestBed.resetTestingModule();
    TestBed.overrideComponent(ProductosForm, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [ProductosForm],
      providers: [
        FormBuilder,
        { provide: ApiResponseService, useValue: mockApiResponseS },
        { provide: AuthService, useValue: mockAuthS },
        { provide: DynamicDialogConfig, useValue: mockConfig },
        { provide: DynamicDialogRef, useValue: mockRef },
        { provide: EnumSelectService, useValue: mockEnumSelectS },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ProductosForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signals', () => {
    expect(component.id()).toBe('');
    expect(component.submitting()).toBe(false);
    expect(component.cb_category()).toEqual([]);
    expect(component.cb_clasificacion()).toEqual([]);
  });

  it('should load catalogues on ngOnInit', async () => {
    const mockCategories = [{ value: 1, label: 'Cat A' }];
    const mockClasificacion = [{ value: 10, label: 'Clas A' }];
    mockApiResponseS.onGetSelectItem.mockResolvedValue(mockCategories);
    mockEnumSelectS.productClasificacion.mockReturnValue(of(mockClasificacion));

    await component.ngOnInit();

    expect(mockApiResponseS.onGetSelectItem).toHaveBeenCalledWith('Categories');
    expect(mockEnumSelectS.productClasificacion).toHaveBeenCalled();
    expect(component.cb_category()).toEqual(mockCategories);
    expect(component.cb_clasificacion()).toEqual(mockClasificacion);
  });

  it('should load existing data on ngOnInit when id is provided', async () => {
    mockConfig.data = { id: 'prod-1' };
    mockApiResponseS.onGetSelectItem.mockResolvedValue([]);
    mockEnumSelectS.productClasificacion.mockReturnValue(of([]));
    mockApiResponseS.onGetItem.mockResolvedValue({
      nombreProducto: 'Test Product',
    });

    fixture = TestBed.createComponent(ProductosForm);
    component = fixture.componentInstance;

    await component.ngOnInit();

    expect(mockApiResponseS.onGetItem).toHaveBeenCalledWith('Productos/prod-1');
  });

  it('onSubmit should call onPost when id is empty', () => {
    component.onSubmit();

    expect(mockApiResponseS.validateForm).toHaveBeenCalled();
    expect(mockApiResponseS.onPost).toHaveBeenCalledWith('Productos', expect.any(FormData));
  });

  it('onSubmit should call onPut when id is provided', () => {
    component.id.set('prod-1');
    component.onSubmit();

    expect(mockApiResponseS.onPut).toHaveBeenCalledWith('Productos/prod-1', expect.any(FormData));
  });

  it('savecategoryId should patch form values', () => {
    const item = { value: 5, label: 'Cat 5' };
    component.savecategoryId(item);

    expect(component.form.get('categoryId')?.value).toBe(5);
    expect(component.form.get('category')?.value).toBe('Cat 5');
  });
});
