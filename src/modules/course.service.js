const courseRepo = require("./course.repository");
const ApiError = require("../../utailts/ApiError");
class CourseService {
  async getAllCourses(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const courses = await courseRepo.findAll(skip, limit);
    const total = await courseRepo.count();

    return {
      courses,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    };
  }

  async getCourseById(id) {
    log("id is => ", id);
    const course = await courseRepo.findById(id);

    if (!course) throw new ApiError(404, "Course not found");
    return course;
  }

  async createCourse(data) {
    return courseRepo.create(data);
  }

  async updateCourse(id, data) {
    const course = await courseRepo.update(id, data);
    if (!course) throw new ApiError(404, "Course not found");
    return course;
  }

  async deleteCourse(id) {
    const course = await courseRepo.delete(id);
    if (!course) throw new ApiError(404, "Course not found");
    return { message: "Course deleted successfully" };
  }

  // search and filter methode
  async searchAndFilterCourses(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = courseRepo.buildFilter(query);

    const [courses, total] = await Promise.all([
      courseRepo.findWithQuery(filter, skip, limit),
      courseRepo.count(filter),
    ]);

    return {
      courses,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}

module.exports = new CourseService();
