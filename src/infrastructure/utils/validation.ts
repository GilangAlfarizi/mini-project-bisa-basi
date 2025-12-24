import { ValidationError } from "@nestjs/common";

export const validationUtils = {
    getValidationErrorFirstMessage: (errors: ValidationError[]): string | null =>
        errors.length > 0 ? Object.values(errors[0].constraints ?? {})[0] : null,
}