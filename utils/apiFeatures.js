const buildFilter = (filters) => JSON.stringify(filters).replace(
  /\b(gte|gt|lte|lt)\b/g,
  (match) => `$${match}`
);

const buildSort = (sort) => sort ? sort.split(",").join(" ") : "-createdAt"; 

const buildFields = (fields) => fields ? fields.split(",").join(" ") : "-__v";

const buildKeywordSearch = (keyword) => {
  if (keyword) {
    return {
      $or: [
        { title: { $regex: keyword, $options: "i" } }, 
        { username: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
  }
  return {};
};

module.exports = { buildFilter, buildSort, buildFields, buildKeywordSearch };
