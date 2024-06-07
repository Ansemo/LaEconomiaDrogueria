import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-snack-bar',
  standalone: true,
  template: `
    <div class="custom-snack-bar">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12L16.2426 16.2426M16.2426 7.75736L12 12M12 12L7.75736 7.75736M7.75736 16.2426L12 12M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="#FF4D4F"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ data }}</span>
    </div>
  `,
  styles: [
    `
      .custom-snack-bar {
        width: fit-content;
        display: flex;
        align-items: center;
        background-color: #ffebeb;
        color: #101828;
        padding: 16px 22px;
        border-radius: 8px;
      }
      svg {
        margin-right: 10px;
      }
    `,
  ],
})
export class ErrorSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
