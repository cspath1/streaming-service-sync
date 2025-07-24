import { BadRequestException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { type ZodError } from 'zod';

/**
 * @description Extends the default ZodValidationPipe to return a standardized result response
 * @see https://github.com/BenLorantfy/nestjs-zod?tab=readme-ov-file#creating-custom-validation-pipe
 */
export const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) =>
    new BadRequestException({
      success: false,
      message: 'Validation failed',
      errors: error.errors,
      data: null,
    }),
});
