const mangoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mangoose.Schema({
    name:{
      type:String,
      required:[true,'A tour must have name'],
      unique:true
    },
    slug:String,
    duration:{
      type:Number,
      required:[true,'A tour must have a duration']
    },
    maxGroupSize:{

      type:Number,
      required:[true,'A tour must have group size']
    },
    difficulty:{
      type:String,
      required:[true,'A tour must have difficulty level']
    },
    ratingAverage:{
      type:Number,
      default:4.5
    },
    ratingQuantity:{
      type:Number,
      default:0
    },
    price:{
      type:Number,
      required:[true,'A tour must have price']
    },
    priceDiscount:Number,
    summary:{
      type:String,
      trim:true,
      required:[true,'A tour must have a summary']
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,
      required:[true,'A tour must have a image cover']
    },
    images:[String],
    createdAt:{
      type:Date,
      default:Date.now(),
      select:false
    },
    startDate:[Date]
  },{
    toJSON:{
      virtuals:true
    },
    toObject:{
      virtuals:true
    }
  })

  tourSchema.virtual('durationWeeks').get(function(){

    return this.duration / 7
  })
  
  // tourSchema.pre('save',function(next){

  //   this.slug = slugify(this.name,{lower:true})

  //   next()
  // })

  // tourSchema.post('save',function(doc,next){

  //   console.log(doc)

  //   next()
  // })

  const Tour = mangoose.model('Tour',tourSchema)

  module.exports = Tour