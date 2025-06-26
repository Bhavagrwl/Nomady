const express = require("express");
const mongoose = require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");

const app = express();

app.engine("ejs",ejsMate);

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.urlencoded({extended:true}));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname,"/public")));

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// Index Route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

// new and create route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings",async (req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

// Show Route
app.get("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    res.render("listings/show",{data});
})

// edit and update route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
})

app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    // const {listing}=req.body;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// delete route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
})

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title: "My New Villa",
//         description: "Near beach",
//         price: "12000",
//         location: "Calangute, Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("Sample saved");
//     res.send("Saved");
// })

app.get("/", (req, res) => {
    res.send("Working");
})

app.listen(8080, () => {
    console.log("8080 port listening");
})