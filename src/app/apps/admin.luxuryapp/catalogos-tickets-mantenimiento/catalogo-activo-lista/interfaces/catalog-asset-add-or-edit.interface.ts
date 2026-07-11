import { AssetCategory } from "./asset-category.enum";

export interface CatalogAssetAddOrEdit {
  folio: string;
  name: string;
  assetCategory: AssetCategory;
}
