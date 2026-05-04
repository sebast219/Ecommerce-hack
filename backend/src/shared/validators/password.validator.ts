// 🔐 VALIDADOR DE CONTRASEÑA FUERTE
// PROPÓSITO: Validar contraseñas con reglas de seguridad robustas

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'strongPassword', async: false })
export class StrongPasswordValidator implements ValidatorConstraintInterface {
  
  validate(password: string, args: ValidationArguments) {
    // Mínimo 8 caracteres
    if (password.length < 8) {
      return false;
    }

    // Al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Al menos una minúscula
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Al menos un número
    if (!/[0-9]/.test(password)) {
      return false;
    }

    // Al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'La contraseña debe tener mínimo 8 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*()_+-=[]{};:\'"\\|,.<>/?).';
  }
}
