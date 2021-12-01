const router = require('express').Router();
const {PostsModel} = require("../models");
const {CommentsModel} = require("../models");

const {validateSession}= require('../middleware');


router.post('/post', validateSession, async (req, res) => {

    const {title, content} = req.body;

    try {
        await PostsModel.create({
            title: title,
            content: content,
            userId: req.user.id
        })
        .then(
            post => {
                res.status(201).json({
                    post: post,
                    message: 'post created'
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to create post: ${err}`
        });
    };
});

router.get("/allposts" ,async (req, res) => {

    try {
      const posts = await PostsModel.findAll({
          include: [
              {
                  model: CommentsModel
              }
          ],
        order: [['id', 'ASC']]
      });
      res.status(200).json(posts)
    } catch (err) {
      res.status(500).json({ message: `Failed to get post. (${err})` });
    }
  });

  router.delete("/delete/:id", validateSession, async (req, res) =>{
    try {
        const locatedPost = await PostsModel.destroy({
          where: { id: req.params.id },
        });
        res.status(200).json({ message: "post successfully removed", locatedPost});
      } catch (err) {
        res.status(500).json({ message: `Failed to remove post: ${err}` });
      }
  });


//ADMIN

router.get("/adminposts" ,async (req, res) => {

    try {
      const posts = await PostsModel.findAll({
        order: [['id', 'ASC']]
      });
      res.status(200).json(posts)
    } catch (err) {
      res.status(500).json({ message: `Failed to get post. (${err})` });
    }
  });

router.delete("/:id", async (req, res) =>{
    try {
        const locatedPost = await PostsModel.destroy({
          where: { id: req.params.id },
        });
        res.status(200).json({ message: "post successfully removed", locatedPost});
      } catch (err) {
        res.status(500).json({ message: `Failed to remove post: ${err}` });
      }
  });





module.exports = router;