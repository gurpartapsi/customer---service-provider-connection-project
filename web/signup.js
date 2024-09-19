const express=require("express");
const app=express();
const fileuploader=require("express-fileupload");
const mysql2=require("mysql2");
app.use(express.urlencoded({ extended: true }));
app.listen(3003,function(){
    console.log("balle balle");
})
const obj={
    host:"127.0.0.1",
    user:"root",
    password:"Gaggi@123",
    database:"niharika"
}
const mysql=mysql2.createConnection(obj);
mysql.connect(function(err){
    if(err==null){
        console.log("connected to database");
    }
})
app.use(express.static("public"));
app.get("/in",function(req,resp){
   let path=process.cwd()+"/public/index.html";
   resp.sendFile(path);
})
app.get("/signup",function(req,resp){
//console.log("hii");
 //console.log(req.query.KuchEmail);
   mysql.query("insert into admin values(?,?,?,1,current_date())",[req.query.KuchEmail,req.query.KuchPwd,req.query.Kuchuse],function(err){
    if(err==null){
        
        resp.send("Record saved successfully");
    }
    else{
        resp.send(err.message);
    }
   })
})
app.get("/login",function(req,resp){

    mysql.query("select * from admin where emailid=? and password=?",[req.query.Kuchem,req.query.KuchP],function(err,resultJsonAry){
       if(err){
        resp.send(err.message);
        return;
       }
       if(resultJsonAry.length==1){
        if(resultJsonAry[0].status==1){
            const userType=resultJsonAry[0].usertype;
            resp.send(userType);
        }
        else{
            resp.send("ur account is blocked!! contact admin");
        }
       }
       else{
        resp.send("invalid email ")
       }
    })
})
// app.get("/check-email",function(req,resp)
//     {
//       mysql.query("select * from admin where emailid=?",[req.query.kuchEmail],function(err,resultJsonAry)
//         {
//             if(resultJsonAry.length==1)
//                 resp.send("Not Available");
//             else
//                 resp.send("YESS!!! Available");
//     })
// })

app.get("/admin",function(req,resp){
    let filePath=process.cwd()+"/public/admin-profile.html";
    resp.sendFile(filePath);
})
app.get("/user-manager",function(req,resp){
    let filePath=process.cwd()+"/public/user-manager.html";
    resp.sendFile(filePath);
})
app.get("/providers",function(req,resp){
    let filePath=process.cwd()+"/public/providers.html";
    resp.sendFile(filePath);
})
app.get("/customers",function(req,resp){
    let filePath=process.cwd()+"/public/customer.html";
    resp.sendFile(filePath);
})
app.get("/fetch-all-from-signup",function(req,resp){
    mysql.query("Select * from admin",function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})
app.get("/block",function(req,resp){
    const email=req.query.kuchemail;
    mysql.query("update admin set status=? where emailid=?",[0,email],function(err,resultJsonAry){
        if(err==null)
        {resp.send("updated successfully");}
        else
        {
            console.log(err.message);
        }
    })
})
app.get("/resume",function(req,resp){
    const email=req.query.kuchemail;
    mysql.query("update admin set status=? where emailid=?",[1,email],function(err,resultJsonAry){
        if(err==null)
        {resp.send("updated successfully");}
        else
        {
            console.log(err.message);
        }
    })
})

app.get("/fetch-all-from-customer",function(req,resp){
    mysql.query("Select * from profilesave1",function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})
app.get("/fetch-all-from-provider",function(req,resp){
    mysql.query("Select * from provider",function(err,resultJsonAry){
        if(err){
            console.log(err);
        }
        resp.send(resultJsonAry);
    })
})
app.get("/service-provider-Dash",function(req,resp){
   
    let filePath=process.cwd()+"/public/service-provider-dash.html";
    resp.sendFile(filePath);
})
app.get("/prov",function(req,resp){
    let filePath=process.cwd()+"/public/provider-profile.html";
    resp.sendFile(filePath);
})
app.get("/fetch-city",function(req,resp){
    mysql.query("select distinct city from tasks",function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})
app.get("/fetch-catory",function(req,resp){
    mysql.query("select distinct category from tasks where city=?",[[req.query.kuchcity]],function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})
app.get("/fetch-city-catory",function(req,resp){
    const loc=req.query.kuchcity;
    const cat=req.query.kuchcat;
    mysql.query("select * from tasks where city=? and category=?",[loc,cat],function(err,resultJsonAry){
        //console.log(resultJsonAry);
      if(err==null){
        //console.log(resultJsonAry);
        resp.send(resultJsonAry);
      }
      else{
        resp.send(err.message);
      }
    })
})
app.get("/find_jobs",function(req,resp){
    let filePath=process.cwd()+"/public/find_job.html";
    resp.sendFile(filePath);
})
//create table provider(emailid varchar(255) primary key , name varchar(255),contactno int , gender varchar(255),category varchar(255),firm varchar(255),website varchar(255),location varchar(255), since date, idproof varchar(255),work varchar(255));
app.post("/save",function(req,resp){
    const email=req.body.Eemail;
    const name=req.body.name;
    const cont=req.body.contact;
    const gen=req.body.gender;
    const cat=req.body.taskcat;
    const fir=req.body.firm;
    const web=req.body.web;
    const loc=req.body.loc;
    const sin=req.body.since;
    const work=req.body.work;
    let filename;
    if(req.files==null)
        filename="nopic.jpg";
    else
       {
        filename=req.files.pic.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.pic.mv(path);
       }
       req.body.pic=filename;
    
    mysql.query("insert into provider values(?,?,?,?,?,?,?,?,?,?,?)",[email,name,cont,gen,cat,fir,web,loc,sin,filename,work],function(err){
        if(err==null){
            resp.send("record saved successfully");
        }
        else{
            resp.send(err.message);
        }
    })
})
app.post("/find-record",function(req,resp){
    mysql.query("select * from provider where emailid=?",[req.body.KuchEmail],function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})
app.get("/check",function(req,resp){
    mysql.query("select * from provider where emailid=?",[req.query.KuchEmail],function(err,resultJsonAry){
        if(resultJsonAry.length==1){
            resp.send("present already");
        }
        else{
            resp.send("not present");
        }
    })
})
//create table provider(emailid varchar(255) primary key , name varchar(255),contactno int , gender varchar(255),category varchar(255),firm varchar(255),website varchar(255),location varchar(255), since date, idproof varchar(255),work varchar(255));
app.post("/update",function(req,resp){
    const email=req.body.Eemail;
    const name=req.body.name;
    const cont=req.body.contact;
    const gen=req.body.gender;
    const cat=req.body.taskcat;
    const fir=req.body.firm;
    const web=req.body.web;
    const loc=req.body.loc;
    const sin=req.body.since;
    const work=req.body.work;

    let filename;
    if(req.files==null)
        filename="nopic.jpg";
    else
       {
        filename=req.files.pic.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.pic.mv(path);
       }
       req.body.pic=filename;
    mysql.query("update provider set name=?, contactno=?,gender=?,category=?,firm=?,website=? , location=?,since=?, idproof=?,work=? where emailid=?",[name,cont,gen,cat,fir,web,loc,sin,filename,work,email],function(err){
        if(err==null)
        resp.send("Record Saved Successfullyyy");
    else
        resp.send(err.message);
    })
    })
    app.get("/record",function(req,resp){
        let filePath=process.cwd()+"/public/find-service-provider.html";
        resp.sendFile(filePath);
    })
    app.get("/fetch-loc",function(req,resp){
        mysql.query("select distinct location from provider",function(err,resultJsonAry){
            resp.send(resultJsonAry);
        })
    })

    app.get("/fetch-cat",function(req,resp){
        mysql.query("select distinct category from provider where location=?",[req.query.kuchloc],function(err,resultJsonAry){
            console.log(resultJsonAry);
            resp.send(resultJsonAry);
        })
    })
    app.get("/select-loc-cat",function(req,resp){
        const loc=req.query.kuchloc;
        const cat=req.query.kuchcat;
        mysql.query("select * from provider where location=? and category=?",[loc,cat],function(err,resultJsonAry){
            //console.log(resultJsonAry);
          if(err==null){
            //console.log(resultJsonAry);
            resp.send(resultJsonAry);
          }
          else{
            resp.send(err.message);
          }
        })
    })
    app.get("/customerDash", function (req, resp) {
        let filePath2 = process.cwd() + "/public/customer-dash.html";
        resp.sendFile(filePath2);
    })
    app.get("/req-manager",function(req,resp){
        let path=process.cwd()+"/public/req-manager.html";
       resp.sendFile(path);
    })
    app.get("/find-service-provider",function(req,resp){
            let path=process.cwd()+"/public/find-service-provider.html";
           resp.sendFile(path);
    })
    app.get("/prof",function(req,resp){
        let path=process.cwd()+"/public/customer-profile.html";
       resp.sendFile(path);
    })
    app.get("/add",function(req,resp){
        mysql.query("select * from profilesave1 where emailid=?",[req.query.KuchEmail],function(err,resultJsonAry){
           // console.log(resultJsonAry);
           resp.send(resultJsonAry);
        })
    })
    //create table tasks(rid int auto_increment,emailid varchar(255),category varchar(255),address varchar(255),city varchar(255), upto int,task varchar(255));
    // app.get("/post",function(req,resp){
    //     mysql.query("insert into tasks values(?,?,?,?,?,?)",[req.query.KuchEmail,req.query.Kuchcat,req.query.Kuchadd,req.query.Kuchcity,req.query.Kuchup,req.query.Kuchwork],function(err){
    //         if(err==null)    
    //         resp.send("record saved successfully");
    //     else
    //     resp.send(err.message);
    // console.log(err);
    //     })
    // })
    
    app.get("/post" , function(req , resp)
    {
        // console.log(req.query);
        const email = req.query.KuchEmail;
        const categpry = req.query.Kuchcat;
        const address = req.query.Kuchadd;
        const city = req.query.Kuchcity;
        const upto = req.query.Kuchup;
        const task = req.query.Kuchwork;
        console.log("email"+" "+categpry+" "+address+" "+city+" "+upto+" "+task);
    mysql.query("insert into tasks values(0,?,?,?,?,?,?)" , [email , categpry, address , city , upto , task] , function(err)
    {
        if(err==null)
        {
            resp.send("record saved");
        }
        else
        {
            resp.send(err.message);
        }
    })
    
    })
    app.get("/old",function(req,resp){
        console.log(req.query);
        const pas=req.query.kuchPass;
        // console.log(req.query.KuchEmail);
        mysql.query("select password from admin where emailid=?",[req.query.kuchEmail],function(err,resultJsonAry){
            if (err) {
                console.error(err);
                resp.send("Internal Server Error");
                return;
            }
            console.log(resultJsonAry);
            if (resultJsonAry.length == 1) {
                const storedPassword = resultJsonAry[0].password;
                console.log("ello");
                if (storedPassword === pas){
                    console.log("hello");
                    resp.send("correct");
                } else {
                    console.log("hell");
                    resp.send("Password is not correct");
                }
            }
        })
    })
    app.get("/changepass",function(req,resp){
        mysql.query("update admin set password=? where emailid=?",[req.query.kuchnew, req.query.kuchEmail],function(err){
            if(err==null){
                resp.send("saved");
            }
            else{
                resp.send(err.message);
            }
        })
    })
    app.get("/fetch",function(req,resp){
        const email=req.query.kuchemail;
        mysql.query("select * from tasks where emailid=?",[email],function(err,resultJsonAry){
            if(err==null){
            //console.log(resultJsonAry);
                resp.send(resultJsonAry);
            }
                else{
                console.log(err.message);
                }
        })
    })
    app.get("/delete",function(req,resp){
        const r=req.query.Kuchrid;
        mysql.query("delete from tasks where rid=?",[r],function(err,result){
            if(err==null)
            {
               if(result.affectedRows==1)
                         resp.send("Record Deleted Successfullyyy");
                       else
                       resp.send("Inavlid");
            }
            else
                resp.send(err.message);
        })
    })
    app.use(fileuploader());
app.post("/profile",function(req,resp){
    const email=req.body.Eemail;
    const Name=req.body.name;
    const Contactno=req.body.contact;
    const Add=req.body.address;
    const City=req.body.city;
    const State=req.body.state;

    let filename;
    if(req.files==null)
        filename="nopic.jpg";
    else
       {
        filename=req.files.pic.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.pic.mv(path);
       }
       req.body.pic=filename;
       console.log(filename);
       console.log(req.body);
    mysql.query("insert into profilesave1 values(?,?,?,?,?,?,?)" ,[email,Name,Contactno,Add,City,State,filename],function(err){
        if(err==null)
        resp.send("Record Saved Successfullyyy");
    else
        resp.send(err.message);
    })
})
app.post("/find-record",function(req,resp){
    console.log("i m here");
    console.log(req.body);
    mysql.query("select * from profilesave1 where emailid=?",[req.body.KuchEmail],function(err,resultJsonAry){
        resp.send(resultJsonAry);
    })
})
app.get("/check",function(req,resp){
    mysql.query("select * from profilesave1 where emailid=?",[req.query.KuchEmail],function(err,resultJsonAry){
        if(resultJsonAry.length==1){
            resp.send("present already");
        }
        else{
            resp.send("not present");
        }
    })
})
app.post("/update",function(req,resp){
    const email=req.body.Eemail;
    const Name=req.body.name;
    const Contactno=req.body.contact;
    const Add=req.body.address;
    const City=req.body.city;
    const State=req.body.state;

    let filename;
    if(req.files==null)
        filename="nopic.jpg";
    else
       {
        filename=req.files.pic.name;
        let path=process.cwd()+"/public/uploads/"+filename;
        req.files.pic.mv(path);
       }
       req.body.pic=filename;
    mysql.query("update profilesave1 set name=?, contactno=?,address=?,city=?,state=?,profilepic=? where emailid=?",[Name,Contactno,Add,City,State,filename,email],function(err){
        if(err==null)
        resp.send("Record Saved Successfullyyy");
    else
        resp.send(err.message);
    })
    })
