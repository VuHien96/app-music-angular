import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../_core/service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SigninRequestPayload} from '../../_core/request/signinRequest.payload';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  registerSuccessMessage: string;
  loginForm: FormGroup;
  signinRequest: SigninRequestPayload;
  isError: boolean;

  constructor(private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private toastr: ToastrService,
              private fb: FormBuilder,
              private router: Router
  ) {
    this.signinRequest = {
      email: '',
      password: ''
    };
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.toastr.success('Signup Successful');
          this.registerSuccessMessage = 'Please Check your inbox for activation email '
            + 'activate your account before you Login!';
        }
      });
  }

  signin() {
    if (!this.loginForm.controls.email.errors && !this.loginForm.controls.password.errors) {
      // tslint:disable-next-line:forin
      for (const a in this.loginForm.controls) {
        this.signinRequest[a] = this.loginForm.controls[a].value;
      }
      this.authService.signin(this.signinRequest).subscribe(data => {
        this.isError = false;
        this.router.navigateByUrl('');
        this.toastr.success('Đăng nhập thành công');
      }, error => {
        this.isError = true;
        throwError(error);
      });
    }
  }


  errorRequired(input, err): string {
    switch (input) {
      case this.loginForm.controls.email:
        err = 'Vui lòng nhập email';
        break;
      case this.loginForm.controls.password:
        err = 'Vui lòng nhập mật khẩu';
        break;
    }
    return err;
  }

  errorPattern(input, err): string {
    switch (input) {
      case this.loginForm.controls.email:
        err = 'Email không hợp lệ';
        break;
    }
    return err;
  }

  getErrorMessage(input) {
    let err = '';
    if (input.errors) {
      if (input.hasError('required')) {
        err = this.errorRequired(input, err);
      } else if (input.hasError('email')) {
        err = this.errorPattern(input, err);
      }
    } else {
      err = '';
    }
    return err;
  }

}
