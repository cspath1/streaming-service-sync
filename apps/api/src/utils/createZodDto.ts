import { ZodDto, zodToOpenAPI } from 'nestjs-zod';
import { ZodSchema, ZodTypeDef } from 'zod';

/**
 * @see https://github.com/BenLorantfy/nestjs-zod/issues/120
 * @param schema
 * @returns
 */
export function createZodDto<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
>(schema: ZodSchema<TOutput, TDef, TInput>) {
  class AugmentedZodDto {
    public static isZodDto = true;
    public static schema = schema;

    public static _OPENAPI_METADATA_FACTORY(): Record<string, any> | undefined {
      return zodToOpenAPI(this.schema).properties;
    }

    public static create(input: unknown) {
      return this.schema.parse(input);
    }
  }

  return AugmentedZodDto as unknown as ZodDto<TOutput, TDef, TInput>;
}
