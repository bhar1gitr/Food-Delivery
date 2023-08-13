const mongoose = require('mongoose');

const mongoURI ="mongodb+srv://bhar1gitr:htmlpp123@cluster0.uvhpsnk.mongodb.net/goofoodmern";
mongoose.set('strictQuery', true);

const mongoDB = async()=>{
   await mongoose.connect(process.env.MONGODB_URI,async(err,result)=>{
        if (err) console.log(err);
        else{
            console.log("Connected to Mongo");
            const fetch_data = await mongoose.connection.db.collection("food_items");
            fetch_data.find({}).toArray(async function(err,data){
                const foodCategory = await mongoose.connection.db.collection("foodCategory")
                foodCategory.find({}).toArray(function(err,catData){
                    if(err) console.log(err);
                    else{
                        global.food_items = data;
                        global.foodCategory = catData;
                    }
                })
            })
        }
    });
}
module.exports = mongoDB;

