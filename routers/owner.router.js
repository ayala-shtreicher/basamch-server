const express = require("express");
const Joi = require("joi");
const { register, login, getOwner, getOwners, updateOwner, deleteOwner } = require("../controllers/owner.controller");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getOwner/:id", getOwner);
router.get("/getOwners", getOwners);
router.put("/updateOwner/:id",auth,updateOwner)
router.delete("/deleteOwner/:id",auth,deleteOwner)
module.exports = router;