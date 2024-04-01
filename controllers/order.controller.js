const Joi = require("joi");
const { Order } = require("../models/order.model");
const { Types } = require("mongoose");
const AppError = require("../utils/AppError");
const { updateResort } = require("./resort.controller");
const { Resort } = require("../models/resort.model");
const orderJoiSchema = {
    add: Joi.object().keys({
        dateOrder: Joi.date().required(),
        dateStart: Joi.date().required(),
        dateEnd: Joi.date().required(),
        sumOrder: Joi.number().required(),
        userId:Joi.string().required(),
        resortId:Joi.string().required()
    }),
    update:
        Joi.object().keys({
            dateOrder: Joi.date(),
            dateStart: Joi.date(),
            dateEnd: Joi.date(),
            sumOrder: Joi.number(),
            userId:Joi.string(),
            resortId:Joi.string()
        }),
};


// Function to create date range array from start date to end date
function createDateRangeArray(startDate, endDate) {
    const dateRangeArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dateRangeArray.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateRangeArray;
}

// Function to check if a date range is occupied for a given resort
async function isDateRangeOccupied(resortId, startDate, endDate) {
    const resortOrders = await Order.find({ resortId: resortId });
    const occupiedDates = resortOrders.reduce((acc, order) => {
        const orderStartDate = new Date(order.dateStart);
        const orderEndDate = new Date(order.dateEnd);
        const datesInRange = createDateRangeArray(orderStartDate, orderEndDate);
        return [...acc, ...datesInRange];
    }, []);

    const dateRangeArray = createDateRangeArray(startDate, endDate);
    return dateRangeArray.some(date => occupiedDates.includes(date));
}

exports.addOrder = async (req, res, next) => {
    const body = req.body;
    try {
        const validate = orderJoiSchema.add.validate(body);
        if (validate.error) {
            throw Error(validate.error);
        }

        body.dateOrder = new Date(body.dateOrder);
        body.dateStart = new Date(body.dateStart);
        body.dateEnd = new Date(body.dateEnd);

        if (body.dateStart.getTime() >= body.dateEnd.getTime()) {
            throw new Error("Invalid date range");
        }
        const resortId=body.resortId;
        body.resortId = new Types.ObjectId(body.resortId);
        body.userId = new Types.ObjectId(body.userId);

        // Check if any dates in the range are already occupied
        const overlap = await isDateRangeOccupied(body.resortId, body.dateStart, body.dateEnd);
        if (overlap) {
            throw new Error("Date range is already occupied");
        }
    const occupiedDates= await this.datTokenForResort(resortId);
         const update=await Resort.updateOne({id:resortId},{events:occupiedDates})
        const newOrder = new Order(body);
        await newOrder.save();

        return res.status(201).send(newOrder);
    } catch (error) {
        next(error);
    }
};
exports.datTokenForResort=async(resortId)=>{
    const orders = await Order.find({ resortId: resortId }).populate("resortId");
    const occupiedDates = orders.reduce((acc, order) => {
        const startDate = new Date(order.dateStart);
        const endDate = new Date(order.dateEnd);

        const datesInRange = createDateRangeArray(startDate, endDate);
        return [...acc, ...datesInRange];
    }, []);
    return occupiedDates;

}
exports.dateToken = async (req, res, next) => {
    try {
        if(req.type=="owner"){

        const { resortId } = req.params;
        const occupiedDates=this.datTokenForResort(resortId)
        res.status(200).json({ occupiedDates });}
    } catch (error) {
        next(error);
    }
};

exports.updateOrder=async(req,res,next)=>{
    try {
        const body = req.body;
        const {id}=req.params;
        const validate = orderJoiSchema.update.validate(body);
        if (validate.error) {
            throw Error(validate.error);
        }
        if (body.dateOrder) {
            body.dateOrder = new Date(body.dateOrder);
        }
        if (body.dateStart&&body.dateEnd) {
            body.dateStart = new Date(body.dateStart); 
            body.dateEnd = new Date(body.dateEnd);
            if (body.dateStart.getTime()<body.dateEnd.getTime()) {
            }else{
                throw new Error("date invalid 1")
            }
            const today = new Date(); // יצירת תאריך ליום הנוכחי
            if(body.dateStart.getTime() <= today.getTime()){
                throw new Error("date invalid 2")
            }
        }
    
        const updateOrder = await Order.updateOne({id:id},body);
        return res.status(201).send(updateOrder);

    } catch (error) {
        next(error)
    }
}

exports.deleteOrder=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const deleteOne = await Order.deleteOne({id:id});
        return res.status(201).send(deleteOne);

    } catch (error) {
        next(error)
    }
}

exports.getAll=async(req,res,next)=>{
    try {
        // if(req.type=="user"){
            const orders=await Order.find({}).populate("resortId").populate("userId");
            if (!orders) return next(new AppError(400, "resort not exist"));
    
            return res.status(200).send({
                status:"success",
                orders
            })
        // }else{
        //     return next(new AppError(400, "Not authorized"));
        // }
      
    } catch (error) {
        next(error)
    }
}

exports.getOrder=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const order=await Order.findOne({id:id}).populate("resortId").populate("userId");
        if (!order) return next(new AppError(400, "order not exist"));

        return res.status(200).send({
            status:"success",
            order
        })
    } catch (error) {
        next(error)
    }
}
exports.getOrderByUserId=async(req,res,next)=>{
    try {
        const {userId}=req.params;
        const orders=await Order.find({userId:userId}).populate("resortId").populate("userId");
        if (!orders) return next(new AppError(400, "resort not exist"));

        return res.status(200).send({
            status:"success",
            orders
        })
    } catch (error) {
        next(error)
    }
}

