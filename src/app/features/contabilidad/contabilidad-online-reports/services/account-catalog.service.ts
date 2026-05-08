import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { IAccountFlatItem, IAccountTreeNode } from '../models/report-definition.interface';

@Injectable({ providedIn: 'root' })
export class AccountCatalogService {
  private api = inject(ApiResponseService);

  private cacheTree = new Map<string, IAccountTreeNode[]>();
  private cacheFlat = new Map<string, IAccountFlatItem[]>();

  /**
   * Obtiene el catálogo de cuentas en formato árbol desde la API.
   * @param customerId ID del cliente.
   * @param year Año fiscal.
   * @param empresa Nombre de la empresa Aspel.
   */
  async getTree(customerId: string, year: number, empresa: string = 'Contabilidad'): Promise<IAccountTreeNode[]> {
    const key = `${customerId}-${year}-${empresa}`;
    if (this.cacheTree.has(key)) return this.cacheTree.get(key)!;

    const data = await this.api.onGetItem<IAccountTreeNode[]>(
      `dynamic-reports/accounts/${customerId}/${year}/tree?empresa=${empresa}`
    );
    const tree = data ?? [];
    if (tree.length > 0) this.cacheTree.set(key, tree);
    return tree;
  }

  /**
   * Obtiene el catálogo de cuentas en formato plano desde la API.
   * @param customerId ID del cliente.
   * @param year Año fiscal.
   * @param empresa Nombre de la empresa Aspel.
   */
  async getFlat(customerId: string, year: number, empresa: string = 'Contabilidad'): Promise<IAccountFlatItem[]> {
    const key = `${customerId}-${year}-${empresa}`;
    if (this.cacheFlat.has(key)) return this.cacheFlat.get(key)!;

    const data = await this.api.onGetItem<IAccountFlatItem[]>(
      `dynamic-reports/accounts/${customerId}/${year}?empresa=${empresa}`
    );
    const flat = data ?? [];
    if (flat.length > 0) this.cacheFlat.set(key, flat);
    return flat;
  }

  /**
   * Limpia el caché local de catálogos.
   */
  clearCache() {
    this.cacheTree.clear();
    this.cacheFlat.clear();
  }
}
