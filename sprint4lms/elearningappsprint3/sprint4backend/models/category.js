const mongoose =require ("mongoose");

const CategorySchema = mongoose.Schema({
     

     categoryName : {
           type :  String  
      },

     


     categoryDescription :   {
           type :  String  
     },
      categoryImage :   {
        type :  String  
     },
      categorySlug :  {
        type :  String  
     }, 


});


CategorySchema.set("timestamps", true);

module.exports = mongoose.model("Category", CategorySchema);