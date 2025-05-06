"use strict";

const AccessService = require("../services/access.service");
const { CREATED } = require("../core/success.response");

class AccessController {
  signup = async (req, res, next) => {
    const result = await AccessService.signUp(req.body);
    if (result.status === 201) {
      return new CREATED({
        message: "Create new shop success",
        metadata: result.metadata,
      }).send(res);
    }
  };
}

module.exports = new AccessController();
