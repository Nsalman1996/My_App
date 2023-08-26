import { app } from "./app";
// import "./db/mongo.connection";

app.get("/api/profile",(req,res)=>{
    res.send("Profile service active");
})

app.listen(app.get("PORT"), app.get("HOST"), () => {
    console.log("Server running on  :" + app.get("HOST") + ":" + app.get("PORT"));
})