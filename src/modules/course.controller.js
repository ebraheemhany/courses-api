const CourseService = require("./course.service");
const apiResponse = require("../../utailts/apiResponse");
const status = require("../../utailts/status");
class CourseController {
  async getAll(req, res) {
    const courses = await CourseService.getAllCourses();
    apiResponse(res, 200, status.SUCCESS, null, courses);
  }

  async getOne(req, res) {
    const course = await CourseService.getCourseById(req.params.id);
    apiResponse(res, 200, status.SUCCESS, course, null);
  }

  async create(req, res) {
    const course = await CourseService.createCourse(req.body);
    apiResponse(res, 200, status.SUCCESS, null, { course });
  }

  async update(req, res) {
    const course = await CourseService.updateCourse(req.params.id, req.body);
    apiResponse(res, 200, status.SUCCESS, course, null);
  }

  async remove(req, res) {
    const result = await CourseService.deleteCourse(req.params.id);
    apiResponse(res, 200, status.SUCCESS, null, "Course deleted");
  }
}

module.exports = new CourseController();
