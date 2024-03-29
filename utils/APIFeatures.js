class APIFeature {

    constructor(query, queryStr) {
  
      this.query = query;
  
      this.queryStr = queryStr;
    }
  
    filter() {
      const queryObj = { ...this.queryStr };
  
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
  
      excludedFields.forEach((el) => delete queryObj[el]);
  
      let queryString = JSON.stringify(queryObj);
  
      queryString = queryString.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`,
      );
  
      this.query = this.query.find(JSON.parse(queryString));
  
      return this;
    }
  
    sort() {
        if (this.queryStr.sort) {
          const sortBy = this.queryStr.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy);
        } else {
          this.query = this.query.sort('-_id');
        }
    
        return this;
      }
  
    limitFields() {
      if (this.queryStr.fields) {
        const fields = this.queryStr.fields.split(',').join(' ');
  
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    pagination() {
      const page = Number(this.queryStr.page) || 1;
  
      const limit = Number(this.queryStr.limit) || 100;
  
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }

  module.exports = APIFeature