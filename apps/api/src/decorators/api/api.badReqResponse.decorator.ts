import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { createZodDto } from '../../utils/createZodDto';
import { z } from 'zod';

const BadReqResponseSchema = z.object({
  success: z.literal(false),
  message: z.literal('Validation Failed'),
  errors: z.array(z.any()),
  data: z.null(),
});

export function ApiBadReqResponse() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: createZodDto(BadReqResponseSchema),
    }),
  );
}
