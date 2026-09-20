import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UpdatePasswordComponent } from "./update-password";
import { UpdateUserPhotoComponent } from "./update-user-photo";
@Component({
  selector: "app-update-profile-wrapper",
  template: `
    <div class="row gap-4 lg:gap-0">
      <div class="col-12 col-lg-6">
        <app-actualizar-contrasena />
      </div>
      <div class="col-12 col-lg-6">
        <app-actualizar-foto-usuario-aplicacion />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpdateUserPhotoComponent, UpdatePasswordComponent],
})
export class UpdateProfileWrapper {}
