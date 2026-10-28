import { AbstractControl, ValidationErrors } from '@angular/forms';

export function notBlank(control: AbstractControl): ValidationErrors | null {
  return String(control.value ?? '').trim().length ? null : { blank: true };
}