const express = require("express");
const router = express.Router();
const {BlogModel} = require("../models");
const {validateSession}= require('../middleware');

//!  CREATE ITEM
router.post("/create", validateSession, async (req, res) => {
      const { blogcontent, feeling } = req.body;
      const blog = {
            blogcontent,
            feeling,
            userId: req.user.id
      }

      try{
        const newBlog = await BlogModel.create(blog);
        res.status(201).json( newBlog )

      }catch (err){
        res.status(500).json({
            message: `Failed to add blog. ${err}`
        })
    }
});

//!  GET ALL ITEMS BY USER
router.get("/myblogs", validateSession ,async (req, res) => {

    try {
      const userBlogs = await BlogModel.findAll({
        where: {
          userId: req.user.id
        },
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(userBlogs)
    } catch (err) {
      res.status(500).json({ message: `Failed to get blog. (${err})` });
    }
  });

//!  DELETE ITEM BY ID
router.delete("/:id", validateSession, async (req, res) =>{
  try {
      const locatedBlogModel = await BlogModel.destroy({
        where: { id: req.params.id },
      });
      res.status(200).json({ message: "blog successfully removed", locatedBlogModel});
    } catch (err) {
      res.status(500).json({ message: `Failed to remove blog: ${err}` });
    }
});

//!  UPDATE/EDIT ITEM
router.put("/:id", validateSession, async (req, res) => {
  const { blogcontent, feeling } = req.body;
  try {
    const updatedBlog = BlogModel.update(
      { blogcontent, feeling },
     { where: { id: req.params.id}, returning: true }
    ).then((result) => {
      res.status(200).json({ message: " blog successfully updated", updatedBlog, result });
    });
  } catch (err) {
    res.status(500).json({ message: `Failed to update blog: ${err}` });
  }
});

module.exports = router;
