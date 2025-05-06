"use strict";

const { StatusCodes } = require("../utils/statusCodes");
const { ReasonPhrases } = require("../utils/reasonPhrases");

class SuccessResponse {
  constructor({
    statusCodes = StatusCodes.OK,
    reasonStatusCodes = ReasonPhrases.OK,
    message,
    metadata = {},
  }) {
    this.status = statusCodes;
    this.message = !message ? reasonStatusCodes : message;
    this.metadata = metadata;
  }

  send(res) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      statusCodes: StatusCodes.OK,
      reasonStatusCodes: ReasonPhrases.OK,
      message,
      metadata,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, metadata = {}, options = {} }) {
    super({
      statusCodes: StatusCodes.CREATED,
      reasonStatusCodes: ReasonPhrases.CREATED,
      message,
      metadata,
    });
    this.options = options;
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
