const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema;

const listingSchema = new Schema({

    title : {
        type : String,
        require :true
    },
     description: {
        type : String,
     },
    // image : {
    //     type :String,
    //     default :" https://unsplash.com/photos/a-restaurant-with-tables-and-chairs-covered-in-blankets-05cDX4y2oJ8",
    //     set : (v)=> v === "" ? "https://unsplash.com/photos/a-restaurant-with-tables-and-chairs-covered-in-blankets-05cDX4y2oJ8":v,
    // },

    image: {
        url: { type: String },
        filename: { type: String },
      },

        price : Number,
        location: String,
        country: String,

        reviews: [
          {
              type: Schema.Types.ObjectId,
              ref: "Review"
          },
      ],

      owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
      },
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;