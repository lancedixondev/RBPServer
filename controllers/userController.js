const router = require('express').Router();
const { UserModel } = require('../models');
const { PostsModel } = require('../models');
const { CommentsModel } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');

router.post('/register', async(req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try{
        const newUser = await UserModel.create({
            firstName, lastName, email, password: bcrypt.hashSync(password, 10)
        });

        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "User Registered!",
            user: newUser,
            token
        })
    }catch(err){
        if(err instanceof UniqueConstraintError){
            res.status(409).json({
                message: "Email already in use."
            });
        } else{
            res.status(500).json({
                error: `Failed to register user: ${err}`
            });
        }
    }
});

router.get('/login', async(req, res) => {

})

router.post('/login', async(req, res) => {
    const {email, password} = req.body;
    let token

    try{
        const loginUser = await UserModel.findOne({
            where: {email: email}
        });

        if(loginUser){
            let passwordComparison =  await bcrypt.compare(password, loginUser.password);

            if(passwordComparison){
                token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect password!"
                });
            }
        } else{
            res.status(401).json({
                message: "Email not found!"
            });
        }
    }catch(err){
        res.status(500).json({
            message: "Error logging in!"
        });
    };
});

//!  RESET USER PASSWORD
router.put('/:id', async (req, res) => {
    const { password } = req.body;
    const ownerId = req.body.id

    const query = {
        where: {
            password: password
        }
    }
    const updatedPW = {password:  bcrypt.hashSync(password, 13)}

    try {
        const update =  await UserModel.update(updatedPW, query);
            res.status(200).json({
                message: "Updated password", 
                id: ownerId,
                password: updatedPW
            });
    }   catch(err) {
        res.status(500).json({message: `Failed to update password. ${err}`})
    }
});

//!  DELETE ITEM
router.delete("/:id", async (req, res) =>{
    try {
        const locatedUser = await UserModel.destroy({
          where: { id: req.params.id },
        });
        res.status(200).json({ message: "user successfully removed", locatedUser});
      } catch (err) {
        res.status(500).json({ message: `Failed to remove user: ${err}` });
      }
    });


router.get('/userinfo', async (req, res) => {
    try {
        await UserModel.findAll({
            include: [
                {
                    model: PostsModel,
                    include: [
                        {
                            model: CommentsModel
                        }
                    ]
                }
            ]
        })
        .then(
            users => {
                res.status(200).json({
                    users: users
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve users: ${err}`
        });
    };
});


// ADMIN

router.delete("/:id", async (req, res) =>{
    try {
        const locatedUser = await UserModel.destroy({
          where: { id: req.params.id },
        });
        res.status(200).json({ message: "user successfully removed", locatedUser});
      } catch (err) {
        res.status(500).json({ message: `Failed to remove user: ${err}` });
      }
    });

router.get('/allUsers', async(req, res) => {
    try {
        const users = await UserModel.findAll();
        res.status(200).json(users)
      } catch (err) {
        res.status(500).json({ message: `Failed to get users. (${err})` });
      }
    })

module.exports = router;