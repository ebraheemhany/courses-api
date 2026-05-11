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

  //  filter and search and pagination methods
  findWithQuery(filter = {}, skip = 0, limit = 10) {
    return Course.find(filter).skip(skip).limit(limit);
  }

  buildFilter(query) {
    const filter = {};
    // search by title
    if (query.title) {
      filter.title = {
        $regex: query.title,
        $options: "i",
      };
    }
    // filter by price range
    if (query.minPrice || query.maxPrice) {
      filter.price = {
        ...(query.minPrice && { $gte: Number(query.minPrice) }),
        ...(query.maxPrice && { $lte: Number(query.maxPrice) }),
      };
    }
    return filter;
  }

  count(filter = {}) {
    return Course.countDocuments(filter);
  }
}

module.exports = new CourseRepo();
