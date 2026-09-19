import { globalFilterFields, tableRows, rowsPerPageOptions, tableDefaultRows } from './table-options';

describe('tablePrimengOption helpers', () => {
  it('globalFilterFields should exist', () => {
    expect(globalFilterFields).toBeDefined();
  });

  it('tableRows should exist', () => {
    expect(tableRows).toBeDefined();
  });

  it('rowsPerPageOptions should exist', () => {
    expect(rowsPerPageOptions).toBeDefined();
  });

  it('tableDefaultRows should exist', () => {
    expect(tableDefaultRows).toBeDefined();
  });
});
