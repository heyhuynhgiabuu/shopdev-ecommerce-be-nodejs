"use strict";

const ReasonPhrases = {
  // 2xx Success
  OK: "OK",
  CREATED: "Created",
  ACCEPTED: "Accepted",
  NO_CONTENT: "No Content",
  RESET_CONTENT: "Reset Content",
  PARTIAL_CONTENT: "Partial Content",

  // 3xx Redirection
  MOVED_PERMANENTLY: "Moved Permanently",
  FOUND: "Found",
  SEE_OTHER: "See Other",
  NOT_MODIFIED: "Not Modified",
  TEMPORARY_REDIRECT: "Temporary Redirect",
  PERMANENT_REDIRECT: "Permanent Redirect",

  // 4xx Client Errors
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  PAYMENT_REQUIRED: "Payment Required",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  METHOD_NOT_ALLOWED: "Method Not Allowed",
  NOT_ACCEPTABLE: "Not Acceptable",
  PROXY_AUTHENTICATION_REQUIRED: "Proxy Authentication Required",
  REQUEST_TIMEOUT: "Request Timeout",
  CONFLICT: "Conflict",
  GONE: "Gone",
  LENGTH_REQUIRED: "Length Required",
  PRECONDITION_FAILED: "Precondition Failed",
  PAYLOAD_TOO_LARGE: "Payload Too Large",
  URI_TOO_LONG: "URI Too Long",
  UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",
  RANGE_NOT_SATISFIABLE: "Range Not Satisfiable",
  EXPECTATION_FAILED: "Expectation Failed",
  UNPROCESSABLE_ENTITY: "Unprocessable Entity",
  TOO_MANY_REQUESTS: "Too Many Requests",

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  NOT_IMPLEMENTED: "Not Implemented",
  BAD_GATEWAY: "Bad Gateway",
  SERVICE_UNAVAILABLE: "Service Unavailable",
  GATEWAY_TIMEOUT: "Gateway Timeout",
  HTTP_VERSION_NOT_SUPPORTED: "HTTP Version Not Supported",
  NETWORK_AUTHENTICATION_REQUIRED: "Network Authentication Required",
};

module.exports = {
  ReasonPhrases,
};
