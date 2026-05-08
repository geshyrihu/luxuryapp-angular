// file-explorer.service.ts
import { Injectable } from "@angular/core";
import { ApiResponseService } from "src/app/core/services/api-response.service";
export interface FileSystemItem {
  name: string;
  path: string;
  isDirectory: boolean;
  extension?: string;
  size?: number;
  modified?: string;
}

@Injectable({
  providedIn: "root",
})
export class FileExplorerService {
  constructor(private apiRequest: ApiResponseService) {}

  // file-explorer.service.ts
  async getContents(
    customerId: string,
    relativePath: string = "",
  ): Promise<{ directories: FileSystemItem[]; files: FileSystemItem[] }> {
    try {
      const result = await this.apiRequest.onGetList<{
        directories: FileSystemItem[];
        files: FileSystemItem[];
      }>(`customers/${customerId}/files`, { path: relativePath });

      return result || { directories: [], files: [] };
    } catch (error) {
      console.error("Error fetching contents:", error);
      return { directories: [], files: [] };
    }
  }

  //   getFileUrl(customerId: string, relativePath: string): string {
  //     return this.apiRequest.getApiUrl(
  //       `customers/${customerId}/files/download?path=${encodeURIComponent(
  //         relativePath
  //       )}`
  //     );
  //   }
}









