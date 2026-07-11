import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UpdatePasswordComponent } from "./update-password";
import { UpdateUserPhotoComponent } from "./update-user-photo";
@Component({
  selector: "app-update-profile-wrapper",
  template: `
    <div class="grid gap-4 lg:gap-0">
      <div class="col-12 lg:col-6">
        <app-actualizar-contrasena />
      </div>
      <div class="col-12 lg:col-6">
        <app-actualizar-foto-usuario-aplicacion />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpdateUserPhotoComponent, UpdatePasswordComponent],
})
export class UpdateProfileWrapper {}
