const Listing=require("../models/listing.js");
// const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken=process.env.MAP_TOKEN;
// const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

async function geocodeNominatim(location) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "YourAppName/1.0 (your@email.com)"
    }
  });

  return res.json();
}

module.exports.index=async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate({path: "reviews",populate: {path: "author"}}).populate("owner");
    if(!data){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show",{data});
}

module.exports.createListing=async (req,res)=>{

    // let response=await  geocodingClient.forwardGeocode({
    //     query: req.body.listing.location,
    //     limit: 1
    // })
    // .send()
    // console.log(response.body.features[0].geometry);
    // res.send("Doem")

    const geoData = await geocodeNominatim(req.body.listing.location);
    if (!geoData.length) {
        req.flash("error", "Invalid location");
        return res.redirect("/listings/new");
    }
    let url=req.file.secure_url;
    let filename=req.file.public_id;
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)]
    };
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit",{listing,originalImageUrl});
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
        let url=req.file.secure_url;
        let filename=req.file.public_id;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}