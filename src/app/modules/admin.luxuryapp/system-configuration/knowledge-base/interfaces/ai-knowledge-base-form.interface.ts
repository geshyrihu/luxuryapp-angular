import { FormControl } from "@angular/forms";

export interface AiKnowledgeBaseFormGroup {
  id: FormControl<string | null>;
  topic: FormControl<string>;
  instructions: FormControl<string>;
  keywords: FormControl<string>;
  route: FormControl<string>;
  isActive: FormControl<boolean>;
  moduleAppId: FormControl<string | null>;
}
