import { FormGroup } from '@angular/forms';

export class FormUtils {
  static isInvalidField(form: FormGroup, fieldName: string): boolean | null {
    return form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

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
