const mangoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator')

const tourSchema = new mangoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      maxlength:[40,'A tour name must have less or equal than 40 characters'],
      minlength:[10,'A tour name must have greater or equal than 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty level'],
      enum:{
        values:['easy','medium','difficult'],
        message:'difficuly can have either easy, medium or difficult'
      }
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min:[1.0,'A rating must be more than 1.0'],
      max:[5.0,'A rating must be less than or equal to 5.0']
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
    priceDiscount:{
      type:Number,
      validate:{
        validator:function(val){

          //it will only work when we are creating new tour not on updating existing tour
          return val<this.price
        },
        message:'Discount price should be less than actual price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDate: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// tourSchema.pre('save',function(next){

//   this.slug = slugify(this.name,{lower:true})

//   next()
// })

// tourSchema.post('save',function(doc,next){

//   console.log(doc)

//   next()
// })

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

const Tour = mangoose.model('Tour', tourSchema);

module.exports = Tour;
