const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    image:{
        filename: String,
        url:{
            type: String,
            default: "https://unsplash.com/photos/people-sit-near-water-in-a-japanese-garden-GdlcNAU_PW4",
            set: (v)=>v===""?"https://unsplash.com/photos/people-sit-near-water-in-a-japanese-garden-GdlcNAU_PW4":v
        }
    },
    price:{
        type:Number
    },
    location:{
        type: String
    },
    country:{
        type: String
    }
})

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;