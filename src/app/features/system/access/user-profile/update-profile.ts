import { Component, ChangeDetectionStrategy } from "@angular/core";
import { UpdatePasswordComponent } from "./update-password";
import { UpdateUserPhotoComponent } from "./update-user-photo";
@Component({
  selector: "app-update-profile",
  templateUrl: "./update-profile.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [UpdateUserPhotoComponent, UpdatePasswordComponent],
})
export class UpdateProfile {}









