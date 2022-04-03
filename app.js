const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https")

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstName=req.body.FirstName;
    const lastName=req.body.LastName;
    const email=req.body.Email;
    console.log(firstName,lastName,email);
    var data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };
    var jsonData=JSON.stringify(data);
    const url="https://us14.api.mailchimp.com/3.0/lists/"//+ listID
    const options={
        method:"POST",
        auth:"sreeram:" // anyname:apikey
    }

    const request=https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
        console.log(response.statusCode);
        stats=response.statusCode;
        if (stats===200){
            // res.write('Successfully subscribed to Newsletter!!!');
            res.sendFile(__dirname+"/success.html");
        }
        else{
            // res.write("There was an error with signing up..☹️ Try again later 😀")
            res.sendFile(__dirname+"/failure.html");
        }
        
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000,function(){
    console.log("Server started running at 3000 port");
})

