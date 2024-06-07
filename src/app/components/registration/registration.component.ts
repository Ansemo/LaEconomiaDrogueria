import { Component, inject } from '@angular/core';
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
import { StepOneComponent } from '../step-one/step-one.component';
import { StepTwoComponent } from '../step-two/step-two.component';
import { StepThreeComponent } from '../step-three/step-three.component';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    MatSnackBarModule,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  stepOneFormGroup: FormGroup;
  stepTwoFormGroup: FormGroup;
  stepThreeFormGroup: FormGroup;
  currentStep = 1;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.stepOneFormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      joinClub: [false],
      contactAll: [false],
      contactWhatsapp: [false],
      contactEmail: [false],
      contactText: [false],
      contactCall: [false],
    });

    this.stepTwoFormGroup = this.fb.group({
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
    });

    this.stepThreeFormGroup = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  showStep(step: number): boolean {
    return this.currentStep === step;
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    } else {
      this.registerUser();
    }
  }

  registerUser(): void {
    const user = {
      ...this.stepOneFormGroup.value,
      ...this.stepTwoFormGroup.value,
      password: this.stepThreeFormGroup.value.password,
    };

    this.authService.addUser(user).subscribe({
      next: (success) => {
        if (success) {
          this.authService.showSuccess('Usuario registrado exitosamente');
          this.router.navigate(['/login']);
        } else {
          this.authService.showError('Error al registrar el usuario');
        }
      },
      error: (err) => {
        this.authService.showError(err.message);
      },
    });
  }
}
