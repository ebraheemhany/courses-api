const Course = require("./courses.model");

class CourseRepo {
  findAll(skip = 0, limit = 10) {
    return Course.find().skip(skip).limit(limit);
  }

  findById(id) {
    return Course.findById(id);
  }

  create(data) {
    return Course.create(data);
  }

  update(id, data) {
    return Course.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return Course.findByIdAndDelete(id);
  }

  count() {
    return Course.countDocuments();
  }
}

module.exports = new CourseRepo();
