const express = require('express');
const bodyParser = require('body-parser');
const getD = require(__dirname+"/date.js");                      //user made module

const mongoose = require('mongoose');


const app = express();                                            // use express
app.set("view engine","ejs");                                     // enable ejs

mongoose.connect('mongodb+srv://saumya:saumy@123@cluster0.u7gby.mongodb.net/todolistdb', { useNewUrlParser: true ,useUnifiedTopology: true}); // using cluster of cloud url/dbname

app.use(bodyParser.urlencoded({extended:true}));                  // to access data obtained from forms
app.use(express.static("public"));
mongoose.set('useFindAndModify', false);
const itemsSchema = new mongoose.Schema({
  name : String
});
const Item = mongoose.model("Item",itemsSchema);
const item1 = new Item({
  name : "Welcome to ToDoList"
});
const item2 = new Item({
  name : "Use + button to add new task"
});
const item3 = new Item({
  name : "Mark the task do using check box"
});
const defualtItems = [item1,item2,item3];

const listSchema = mongoose.Schema({
     name : String,
      items : [itemsSchema]
});

const List = mongoose.model('List',listSchema);                                  // collection named lists is created in db
app.get('/:listname',(req,res)=>{                                               //when we change url
  let listname =  req.params.listname;
  listname = encodeURIComponent(listname.trim());
  List.findOne({name:listname},function(err,ans){                               // if we find list name in db we render it else we create it and then redirect
    if(err)
    console.log(err);
    else {
      if(ans){
        res.render('list',{listtype:listname, newitem:ans.items})
      }
      else {
        const list = new List({
          name: listname,
          items:defualtItems
        });
        list.save();
        res.redirect('/'+listname);
      }
    }
  });
});

app.post('/bumm/humm',(req,res)=>{                                                 //when we enter custom list name from input box
  const listname =  capitalizeFirstLetter(req.body.custom);
  sParameter = encodeURIComponent(listname.trim());
  List.findOne({name:sParameter},function(err,ans){
    if(err)
    console.log(err);
    else {
      if(!ans){
        const list = new List({
          name: sParameter,
          items:defualtItems
        });
        list.save();
      }
      res.redirect('/'+sParameter);
    }
  });
});

app.get('/',(req,res)=>{
  //let dated = getD.getDay();
   Item.find({},function(err,item){
     if(err)
     console.log(err);
     else {
         if(item){
           if(item.length===0)
           {
               Item.insertMany(defualtItems,function(err){
               if(err)
               console.log(err);
               else {
                 console.log("Success!");
               }
             });
         }
         }
        res.render("list",{listtype:'Today', newitem:item});
     }
   });
});

app.post('/',(req,res)=>{
    const newitem  = req.body.addtask;
    const listname = req.body.list;
    const item = new Item({
      name : newitem
    });
    if(newitem!=""){
        if(listname==="Today"){
          Item.insertMany([item],function(err){
            if(err)
            console.log(err);
          });
          res.redirect('/');
        }
        else {
          List.findOne({name:listname},(err,found)=>{
            if(err)
            console.log(err);
            else {
              found.items.push(item);
              found.save();
              res.redirect('/'+listname);
            }
          });
        }
    }
  });

app.post('/delete',(req,res)=>{
    const id = req.body.checkbox;
    const listname = capitalizeFirstLetter(req.body.list);
    //console.log(id);
    //console.log(listname);
    if(listname==='Today'){
      Item.deleteOne({_id:id},function(err){
        if(err)
        console.log(err);
        else {
         res.redirect('/');
        }
      });
    }
    else {
       List.findOneAndUpdate({name:listname},{$pull: {items: {_id: id}}},function(err,found){
         if(err)
         console.log(err);
         else {
           res.redirect('/'+listname);
         }
       });
    }
  });

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

app.listen(process.env.PORT ||3000,()=>{
  console.log('Server is up and running!');
});
