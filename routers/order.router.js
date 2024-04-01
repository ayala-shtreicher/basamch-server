const express = require("express");
const { addOrder, updateOrder, deleteOrder, getAll, getOrder, dateToken, getOrderByUserId } = require("../controllers/order.controller");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/addOrder",auth(), addOrder);
router.put("/updateOrder/:id",auth(), updateOrder);
router.delete("/deleteOrder/:id",auth(), deleteOrder);
router.get("/getAll",auth(), getAll);
router.get("/getOrder/:id",auth(), getOrder);
router.get("/getOrderByUserId/:userId",auth(), getOrderByUserId);
router.get("/dateTokan/:resortId",dateToken);


module.exports = router;