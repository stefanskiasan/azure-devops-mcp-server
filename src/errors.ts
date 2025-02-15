export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Restore prototype chain in Node.js
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export class ConfigurationError extends BaseError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

export class ApiError extends BaseError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly response?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class WikiError extends ApiError {
  constructor(
    message: string,
    statusCode?: number,
    public readonly wikiId?: string,
    public readonly path?: string,
    response?: unknown
  ) {
    super(message, statusCode, response);
    Object.setPrototypeOf(this, WikiError.prototype);
  }
}

export class WikiNotFoundError extends WikiError {
  constructor(wikiId: string) {
    super(`Wiki with ID ${wikiId} not found`, 404, wikiId);
    Object.setPrototypeOf(this, WikiNotFoundError.prototype);
  }
}

export class WikiPageNotFoundError extends WikiError {
  constructor(wikiId: string, path: string) {
    super(`Wiki page not found at path ${path}`, 404, wikiId, path);
    Object.setPrototypeOf(this, WikiPageNotFoundError.prototype);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}