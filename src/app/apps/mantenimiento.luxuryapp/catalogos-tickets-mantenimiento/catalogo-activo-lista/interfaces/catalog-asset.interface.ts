import { AssetCategory } from "./asset-category.enum";

export interface CatalogAsset {
  id: string;
  folio: string;
  name: string;
  assetCategory: AssetCategory;
}
