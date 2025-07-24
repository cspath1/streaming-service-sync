export type Result<T = any, E = any> = SuccessResult<T> | ErrorResult<E>;

export class SuccessResult<T> {
  success: true = true;
  data: T;
  message: string | null;
  errors = null;

  constructor(data: T, message: string | null = null) {
    this.success = true;
    this.data = data;
    this.message = message;
    this.errors = null;
  }
}

export class ErrorResult<E> {
  success: false = false;
  data: any | null = null;
  message: string;
  errors: E[];

  constructor(message: string, errors: E[], data: any | null = null) {
    this.success = false;
    this.message = message;
    this.errors = errors;
    this.data = data;
  }
}
