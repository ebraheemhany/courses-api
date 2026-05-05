const router = require("express").Router();
const controller = require("./course.controller");
const validate = require("../../middleware/validate");
const courseSchema = require("../../validation/courseValidation");
const asyncHandler = require("../../middleware/asyncHandler");

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getOne));
router.post("/", validate(courseSchema), asyncHandler(controller.create));
router.patch(
  "/:id",
  validate(courseSchema.partial()),
  asyncHandler(controller.update),
);
router.delete("/:id", asyncHandler(controller.remove));

module.exports = router;
