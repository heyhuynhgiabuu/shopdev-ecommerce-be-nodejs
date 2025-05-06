"use strict";

const StatusCodes = {
  // 1xx Informational
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  EARLY_HINTS: 103,

  // 2xx Success
  OK: 200, // Request succeeded
  CREATED: 201, // Resource created successfully
  ACCEPTED: 202, // Request accepted but not completed
  NO_CONTENT: 204, // Request succeeded but no content returned
  RESET_CONTENT: 205, // Reset view after request
  PARTIAL_CONTENT: 206, // Partial GET request succeeded

  // 3xx Redirection
  MULTIPLE_CHOICES: 300, // Multiple options for the resource
  MOVED_PERMANENTLY: 301, // Resource permanently moved
  FOUND: 302, // Resource temporarily moved
  SEE_OTHER: 303, // See other location
  NOT_MODIFIED: 304, // Resource not modified
  TEMPORARY_REDIRECT: 307, // Temporary redirect
  PERMANENT_REDIRECT: 308, // Permanent redirect

  // 4xx Client Errors
  BAD_REQUEST: 400, // Invalid request
  UNAUTHORIZED: 401, // Authentication required
  PAYMENT_REQUIRED: 402, // Payment required
  FORBIDDEN: 403, // No permission to access
  NOT_FOUND: 404, // Resource not found
  METHOD_NOT_ALLOWED: 405, // HTTP method not allowed
  NOT_ACCEPTABLE: 406, // Not acceptable response
  PROXY_AUTH_REQUIRED: 407, // Proxy authentication required
  REQUEST_TIMEOUT: 408, // Request timeout
  CONFLICT: 409, // Resource conflict
  GONE: 410, // Resource no longer available
  LENGTH_REQUIRED: 411, // Content length required
  PRECONDITION_FAILED: 412, // Precondition failed
  PAYLOAD_TOO_LARGE: 413, // Request entity too large
  URI_TOO_LONG: 414, // Request URI too long
  UNSUPPORTED_MEDIA: 415, // Unsupported media type
  RANGE_NOT_SATISFIABLE: 416, // Requested range not satisfiable
  EXPECTATION_FAILED: 417, // Expectation failed
  UNPROCESSABLE_ENTITY: 422, // Unable to process entity
  TOO_MANY_REQUESTS: 429, // Too many requests

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500, // Server internal error
  NOT_IMPLEMENTED: 501, // Request not implemented
  BAD_GATEWAY: 502, // Bad gateway
  SERVICE_UNAVAILABLE: 503, // Service temporarily unavailable
  GATEWAY_TIMEOUT: 504, // Gateway timeout
  HTTP_VERSION_NOT_SUPPORTED: 505, // HTTP version not supported
  NETWORK_AUTH_REQUIRED: 511, // Network authentication required
};

module.exports = {
  StatusCodes,
};
