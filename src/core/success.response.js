"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "Success",
  CREATED: "Created",
};

class SuccessResponse {
  constructor({
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    message,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      metadata,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, metadata = {}, options = {} }) {
    super({
      statusCode: StatusCode.CREATED,
      reasonStatusCode: ReasonStatusCode.CREATED,
      message,
      metadata,
    });
    this.options = options;
  }
}

module.exports = {
  OK,
  CREATED,
};
