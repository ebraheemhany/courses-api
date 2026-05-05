const apiResponse = require("../utailts/apiResponse");
const status = require("../utailts/status");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return apiResponse(res, 400, status.FAIL, null,result.error.issues[0].message);
  }

  req.body = result.data;
  next();
};

module.exports = validate;
