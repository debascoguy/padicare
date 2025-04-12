import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export class Validation {

    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                // if control is empty return no error
                return null;
            }
            // test the value of the control against the regexp supplied
            const valid = regex.test(control.value);
            // if true, return no error (no error), else return error passed in the second parameter
            return valid ? null : error;
        };
    }

    static validateNumeric(): ValidatorFn {
        return Validation.patternValidator(/\d/, { hasNumber: true });
    }

    static validateAllLetters(): ValidatorFn {
        return Validation.patternValidator(/[A-Za-z]/, { hasLetters: true });
    }

    static validateContainsUpperCase(): ValidatorFn {
        return Validation.patternValidator(/[A-Z]/, { hasCapitalCase: true });
    }

    static validateContainsLowerCase(): ValidatorFn {
        return Validation.patternValidator(/[a-z]/, { hasSmallCase: true });
    }

    static validatePassword(minLength: number = 8, specialCharsRegex?: any): ValidatorFn {
        let passwordValidator = [
            Validators.required,
            Validation.validateNumeric,
            Validation.validateContainsUpperCase,
            Validation.validateContainsLowerCase,
            Validators.minLength(minLength)
        ];
        if (!!specialCharsRegex && specialCharsRegex.length > 0) {
            passwordValidator.push(Validation.patternValidator(specialCharsRegex, { hasSpecialChars: true }));
        }
        return Validators.compose(passwordValidator) || (() => null);
    }

    static matchingPasswords(passwordKey: string, confirmPasswordKey: string): any {
        return (group: FormGroup): any => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];
            if (password.value !== confirmPassword.value) {
                confirmPassword.setErrors({ mismatchedPasswords: true });
            } else {
                confirmPassword.setErrors(null);
            }
        }
    }

    static matchingEmails(emailKeys: string, confirmEmailKey: string): any {
        return (group: FormGroup): any => {
            let email = group.controls[emailKeys];
            let confirmEmail = group.controls[confirmEmailKey];
            if (email.value !== confirmEmail.value) {
                confirmEmail.setErrors({ mismatchedEmails: true });
            } else {
                confirmEmail.setErrors(null);
            }
        }
    }

    static validateEmail(email: any): boolean {
        const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regularExpression.test(String(email).toLowerCase());
    }

    static validateEmailField(control: AbstractControl): ValidationErrors | null {
        if (Validation.validateEmail(control.value) == false) {
            return { 'email': true };
        }
        return null;
    }


    /**
     * A conditional validator generator. Assigns a validator to the form control if the predicate function returns true on the moment of validation
     * @example
     * Here if the myCheckbox is set to true, the myEmailField will be required and also the text will have to have the word 'mason' in the end.
     * If it doesn't satisfy these requirements, the errors will placed to the dedicated `illuminatiError` namespace.
     * Also the myEmailField will always have `maxLength`, `minLength` and `pattern` validators.
     * ngOnInit() {
     *   this.myForm = this.fb.group({
     *    myCheckbox: [''],
     *    myEmailField: ['', [
     *       Validators.maxLength(250),
     *       Validators.minLength(5),
     *       Validators.pattern(/.+@.+\..+/),
     *       conditionalValidator(() => this.myForm.get('myCheckbox').value,
     *                            Validators.compose([
     *                            Validators.required,
     *                            Validators.pattern(/.*mason/)
     *         ]),
     *        'illuminatiError')
     *        ]]
     *     })
     * }
     * @param predicate
     * @param validator
     * @param errorNamespace optional argument that creates own namespace for the validation error
     */
    static conditionalValidator(predicate: BooleanFn, validator: ValidatorFn, errorNamespace?: string): ValidatorFn {
        return (formControl => {
            if (!formControl.parent) {
                return null;
            }
            let error = null;
            if (!predicate()) {
                error = validator(formControl);
            }
            if (errorNamespace && error) {
                const customError: Record<string, any> = {};
                customError[errorNamespace] = error;
                error = customError
            }
            return error;
        });
    }

}

export const parseBoolean = (value: string | undefined): boolean => {
  const falseContainer = [undefined, null, "", "false"];
  if (falseContainer.includes(value) || (!!value && value.trim().length === 0)) {
    return false;
  }
  return value === "true" || !!value;
}

export function matchingPasswords(passwordKey: string, confirmPasswordKey: string): any {
  return (group: FormGroup): any => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
          confirmPassword.setErrors({ mismatchedPasswords: true });
      } else {
          confirmPassword.setErrors(null);
      }
  }
}

export function patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
          // if control is empty return no error
          return null;
      }
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);
      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
  };
}

export function validateEmail(email: any) {
  const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regularExpression.test(String(email).toLowerCase());
}

export function ValidateEmailField(control: AbstractControl): ValidationErrors | null {
  if (validateEmail(control.value) == false) {
      return { 'email': true };
  }
  return null;
}

export function matchingEmails(emailKeys: string, confirmEmailKey: string): any {
  return (group: FormGroup): any => {
      let email = group.controls[emailKeys];
      let confirmEmail = group.controls[confirmEmailKey];
      if (email.value !== confirmEmail.value) {
          confirmEmail.setErrors({ mismatchedEmails: true });
      } else {
          confirmEmail.setErrors(null);
      }
  }
}

export interface BooleanFn {
    (): boolean;
}
