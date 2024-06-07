import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
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
import { AuthService } from '../../services/auth.service';
import { LogoComponent } from '../logo/logo.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    LogoComponent,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements AfterViewInit {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  hide = true;
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.setFocus();
    window.addEventListener('resize', () => this.setFocus());
  }

  togglePassword(): void {
    this.hide = !this.hide;
  }

  setFocus(): void {
    const isDesktop = window.innerWidth > 1024;
    if (isDesktop && this.emailInput) {
      this.emailInput.nativeElement.focus();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            this.authService.showSuccess('Usuario o contraseña correctos');
          } else {
            this.authService.showError('Usuario o contraseña incorrectos');
          }
        },
        error: () => {
          this.loading = false;
          this.authService.showError('Error de autenticación');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
