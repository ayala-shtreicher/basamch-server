const express = require("express");
const { register, login,getUser,getUsers, updateUser, deleteUser } = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUser/:id", getUser);
router.get("/getUsers", getUsers);
router.put("/updateUser/:id",auth,updateUser)
router.delete("/deleteUser/:id",auth,deleteUser)
module.exports = router;