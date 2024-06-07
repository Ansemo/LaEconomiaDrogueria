import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { DetailComponent } from '../detail/detail.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    DetailComponent,
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements AfterViewInit {
  @ViewChild('codeInput') codeInput!: ElementRef<HTMLInputElement>;
  changePasswordForm: FormGroup;
  hideNewPassword = true;
  hideConfirmPassword = true;
  loading = false;
  email: string | null = null;
  token: string | null = null;
  maskedEmail: string | null = null;
  generatedCode: string = '';
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private cdRef = inject(ChangeDetectorRef);

  constructor() {
    this.changePasswordForm = this.fb.group(
      {
        code: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
  }

  ngAfterViewInit(): void {
    this.setFocus();
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.token = params['token'];
      if (this.email && this.token) {
        this.maskedEmail = this.maskEmail(this.email);
        this.cdRef.detectChanges();
        this.validateToken(this.email, this.token);
      } else {
        this.authService.showError('Token no válido');
        this.router.navigate(['/request-reset']);
      }
    });
  }

  setFocus(): void {
    if (this.codeInput) {
      this.codeInput.nativeElement.focus();
    }
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  toggleNewPassword(): void {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleConfirmPassword(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    const maskedUser = user.slice(0, 3) + '*****' + user.slice(-1);
    return maskedUser + '@' + domain;
  }

  validateToken(email: string, token: string): void {
    this.authService.validateResetToken(email, token).subscribe({
      next: (isValid) => {
        if (isValid) {
          this.generateVerificationCode(email);
        } else {
          this.authService.showError('Token no válido');
          this.router.navigate(['/request-reset']);
        }
      },
      error: () => {
        this.authService.showError('Error al validar el token');
        this.router.navigate(['/request-reset']);
      },
    });
  }

  generateVerificationCode(email: string): void {
    this.authService.generateVerificationCode(email).subscribe({
      next: (code) => {
        this.generatedCode = code;
        this.changePasswordForm.controls['code'].setValue(this.generatedCode);
      },
      error: () => {
        this.authService.showError(
          'Error al generar el código de verificación'
        );
      },
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      if (this.changePasswordForm.value.code === this.generatedCode) {
        this.loading = true;
        this.authService
          .changePassword(
            this.email!,
            this.changePasswordForm.value.newPassword
          )
          .subscribe({
            next: (success) => {
              this.loading = false;
              if (success) {
                this.authService.showSuccess(
                  'Contraseña restablecida con éxito'
                );
                this.router.navigate(['/login']);
              } else {
                this.authService.showError('Error al cambiar la contraseña');
              }
            },
            error: () => {
              this.loading = false;
              this.authService.showError('Error al cambiar la contraseña');
            },
          });
      } else {
        this.authService.showError('Código de verificación incorrecto');
      }
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
}
