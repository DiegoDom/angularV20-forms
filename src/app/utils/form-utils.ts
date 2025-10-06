import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

async function sleep() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}

export class FormUtils {
  static namePattern =
    '^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: (?:[dD]e|[dD]el|[lL]a)? ?[A-Za-zÁÉÍÓÚáéíóúÑñ]+){1,3}$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[A-Za-z0-9]{4,20}$';

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
        case 'email':
          return 'This field value must be a valid email';
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'This field value must be a valid email';
          }

          return 'Regular expression unhandled error';

        case 'emailTaken':
          return 'This email is already associated with another account';
        case 'notAllowedValue':
          return 'This value is not allowed';

        default:
          return `Field ${key} have an unhandled error`;
      }
    }

    return null;
  }

  static areFieldsEquals(field1: string, field2: string): ValidationErrors | null {
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value
        ? null
        : {
            fieldsNotEquals: true,
          };
    };
  }

  static async validateServerValue(control: AbstractControl): Promise<ValidationErrors | null> {
    await sleep();

    const formValue = control.value;

    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true,
      };
    }

    return null;
  }

  /* static validateNotAllowedValue(control: AbstractControl, value: string): ValidationErrors | null {
    const formValue = control.value;

    if (formValue === value) {
      return {
        notAllowedValue: true,
      };
    }

    return null;
  } */

  static validateNotAllowedValue(notAllowed: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputValue = control.value?.toLowerCase?.().trim?.() ?? '';
      const forbiddenValue = notAllowed.toLowerCase().trim();

      if (inputValue === forbiddenValue) {
        return { notAllowedValue: { value: control.value } };
      }

      return null;
    };
  }
}
