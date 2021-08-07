import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidationService} from '../../_core/service/custom-validation.service';
import {AuthService} from '../../_core/service/auth.service';
import {SignupRequestPayload} from '../../_core/request/signupRequest.payload';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  signupRequest: SignupRequestPayload;

  constructor(private fb: FormBuilder,
              private customValidator: CustomValidationService,
              private authService: AuthService,
              private toastr: ToastrService,
              private router: Router
  ) {
    this.signupRequest = {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      roles: ['user']
    };
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.compose([Validators.required, this.customValidator.patternValidatorFullName()])],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('(84|0[3|5|7|8|9])+([0-9]{8})\\b')]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
    });
  }

  errorRequired(input, err): string {
    switch (input) {
      case this.registerForm.controls.fullName:
        err = 'Vui lòng nhập họ tên';
        break;
      case this.registerForm.controls.email:
        err = 'Vui lòng nhập email';
        break;
      case this.registerForm.controls.phone:
        err = 'Vui lòng nhập số điện thoại';
        break;
      case this.registerForm.controls.password:
        err = 'Vui lòng nhập mật khẩu';
        break;
      case this.registerForm.controls.confirmPassword:
        err = 'Vui lòng nhập nhập lại mật khẩu';
        break;
    }
    return err;
  }

  errorPattern(input, err): string {
    switch (input) {
      case this.registerForm.controls.fullName:
        err = 'Tài khoản không được chứa kí tự đặc biệt';
        break;
      case this.registerForm.controls.email:
        err = 'Email không hợp lệ';
        break;
      case this.registerForm.controls.phone:
        err = 'Số điện thoại không hợp lệ';
        break;
      case this.registerForm.controls.confirmPassword:
        err = 'Mật khẩu không khớp';
        break;
      case this.registerForm.controls.password:
        err = 'Mật khẩu phải từ 6 đến 16 kí tự';
        break;
    }
    return err;
  }

  errorLenght(input, err) {
    switch (input) {
      case this.registerForm.controls.password:
        err = 'Mật khẩu phải từ 6 đến 16 kí tự';
        break;
    }
    return err;
  }

  getErrorMessage(input) {
    let err = '';
    if (input.errors) {
      if (input.hasError('required')) {
        err = this.errorRequired(input, err);
        // tslint:disable-next-line:max-line-length
      } else if (input.hasError('pattern') || input.hasError('email') || input.hasError('min') || input.hasError('passwordMismatch') || input.hasError('invalidFullName')) {
        err = this.errorPattern(input, err);
      } else if (input.hasError('min') || input.hasError('max')) {
        err = this.errorLenght(input, err);
      }
    } else {
      err = '';
    }
    return err;
  }


  signup() {
    if (!this.registerForm.controls.fullName.errors &&
      !this.registerForm.controls.email.errors &&
      !this.registerForm.controls.phone.errors &&
      !this.registerForm.controls.password.errors &&
      !this.registerForm.controls.confirmPassword.errors) {

      // tslint:disable-next-line:forin
      for (const a in this.registerForm.controls) {
        this.signupRequest[a] = this.registerForm.controls[a].value;
      }

      this.authService.signup(this.signupRequest).subscribe(data => {
        this.router.navigate(['/login'],
          {queryParams: {registered: 'true'}});
      }, error => {
        this.toastr.error(error.response.message);
      });
    }
  }
}
