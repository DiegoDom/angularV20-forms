import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './basic-page.component.html',
})
export class BasicPageComponent {
  fb = inject(FormBuilder);

  //**! NOT USE */
  /* myForm = new FormGroup({
    product: new FormControl(''),
    price: new FormControl(0),
    stock: new FormControl(0),
  }); */

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(10)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  isInvalidField(fieldName: string): boolean | null {
    return !!this.myForm.controls[fieldName].errors;
  }

  getFieldError(fieldName: string): string | null {
    if (!this.myForm.controls[fieldName]) return null;

    const errors = this.myForm.controls[fieldName].errors ?? {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `The field ${fieldName} is required`;
        case 'minlength':
          return `The field ${fieldName} must have at least ${errors['minlength'].requiredLength} characters`;
        case 'min':
          return `The field ${fieldName} value must be greater than ${errors['min'].min}`;
      }
    }

    return null;
  }
}
