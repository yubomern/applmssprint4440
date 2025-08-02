



const Category = require("../models/productShop")

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");

const router = express.Router();




router.post("/create-cattag" , (req, res) =>{

    const {data} =  req.body ;

    Category.create({
         data
    });

    res.status(201).json({
        success :  true , 
        data 
    });
});


router.get("/cattags" ,  async (req, res ) =>{


    try {
    const categories = await  Category.find();

      res.status(201).json({
        success: true,
        categories,
      });

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
          });
    }
}) 


router.get("/onecattag/:id" ,   async (req, res) =>{

    try {

        const id  =req.params.id ;
        const category = await Category.findById(id);
        res.status(201).json({
            success: true ,
            category
        })


    }catch (error){

        res.status(500).json({
            success: false,
            message: error.message,
          });
         
    }

})


router.get("/cattag/:id" ,   async (req, res) =>{

    try {

        const id  =req.params.id ;
        const category = await Category.find({
            $id :  [id]
        });
        res.status(201).json({
            success: true ,
            category
        })


    }catch (error){

        res.status(500).json({
            success: false,
            message: error.message,
          });
         
    }

})


router.delete("/findanddelete", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID is required',
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      category: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



router.delete("/deletecattagbyid", async (req, res) => {
    try {
      const { id } = req.params.id;
  
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID is required',
        });
      }
  
      const deletedCategory = await Category.findByIdAndDelete(id);
  
      if (!deletedCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
        category: deletedCategory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });




  router.put("/updatecattag/:id", async (req, res) => {
    try {

        const id  =req.params.id ;

      const {  data } = req.body;
  
      if (!data) {
        return res.status(400).json({
          success: false,
          message: 'ID and update data are required',
        });
      }
  
      const updatedCategory = await Category.findByIdAndUpdate(id, data, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on the update
      });
  
      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        category: updatedCategory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
  







router.patch("/updatepatchcattag/:id", async (req, res) => {
    try {

        const id  =req.params.id ;

      const {  updateData } = req.body;
  
      if (!updateData) {
        return res.status(400).json({
          success: false,
          message: 'ID and update data are required',
        });
      }
  
      const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on the update
      });
  
      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        category: updatedCategory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
  

  



module.exports = router ;