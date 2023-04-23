import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CustomValidators } from '@utils/validators';
import {RequestStatusModel} from "@models/request-status.model";
import {AuthService} from "@services/auth.service";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {

  formUser = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]]
  });

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [ CustomValidators.MatchValidator('password', 'confirmPassword') ]
  });
  status: RequestStatusModel = 'init';
  statusUser: RequestStatusModel = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  showRegister: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
     private authService: AuthService,
  ) {}

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      this.authService.register(name, email, password)
        .subscribe({
          next: () => {
            this.status = 'success';
            this.router.navigate(['/login']);
          },
          error: (e) => {
            this.status = 'failed';
            console.log(e);
          }
        })
      console.log(name, email, password);
    } else {
      this.form.markAllAsTouched();
    }
  }
  validateUser(email: string){
    if (this.formUser.valid) {
      this.statusUser = 'loading';
      this.authService.isAvailable(email)
        .subscribe({
          next: (rta) => {
            this.statusUser = 'success';
            if(rta.isAvailable){
              this.showRegister = true;
              this.form.controls.email.setValue(email);
            } else {
              this.router.navigate(['/login']);
            }
          },
          error: (e) => {
            this.statusUser = 'failed';
            console.log(e);
          }
        })
    } else {
      this.formUser.markAllAsTouched();
    }
  }
}
