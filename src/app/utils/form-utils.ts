import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static isInvalidField(form: FormGroup, fieldName: string): boolean | null {
    return form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return this.getFieldErrorMessage(errors);
  }

  static isInvalidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  static getFieldErrorInArray(formArray: FormArray, index: number) {
    if (formArray.controls.length === 0) return null;
    const errors = formArray.controls[index].errors ?? {};

    return this.getFieldErrorMessage(errors);
  }

  static getFieldErrorMessage(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `This field is required`;
        case 'minlength':
          return `This field must have at least ${errors['minlength'].requiredLength} characters`;
        case 'min':
          return `This field value must be greater than ${errors['min'].min}`;
      }
    }

    return null;
  }
}
