/**
 * Return this from a controller to send `meta` alongside `data`, e.g. list counts or pagination.
 * The response interceptor unwraps it; a plain return value becomes `data` on its own.
 */
export class ResponseWithMeta<T> {
  constructor(
    readonly data: T,
    readonly meta: Record<string, unknown>,
  ) {}
}
