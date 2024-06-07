import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DetailComponent } from '../detail/detail.component';

@Component({
  selector: 'app-request-reset',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    DetailComponent
  ],
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss'],
})
export class RequestResetComponent implements AfterViewInit {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  requestForm: FormGroup;
  loading = false;
  private fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit(): void {
    this.setFocus();
  }

  setFocus(): void {
    if (this.emailInput) {
      this.emailInput.nativeElement.focus();
    }
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.loading = true;
      const { email } = this.requestForm.value;
      this.authService.checkEmailExists(email).subscribe({
        next: (exists) => {
          if (exists) {
            this.authService.generateResetToken(email).subscribe({
              next: (token) => {
                this.loading = false;
                this.router.navigate(['/change-password'], { queryParams: { email, token } });
                this.authService.showSuccess('Código de verificación enviado al correo');
              },
              error: () => {
                this.loading = false;
                this.authService.showError('Error al generar el token');
              }
            });
          } else {
            this.loading = false;
            this.authService.showError('El correo electrónico no existe');
          }
        },
        error: () => {
          this.loading = false;
          this.authService.showError('Error al verificar el correo electrónico');
        }
      });
    } else {
      this.requestForm.markAllAsTouched();
    }
  }

}
