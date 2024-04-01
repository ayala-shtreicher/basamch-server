const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { User } = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

const userJoiSchema = {
    login: Joi.object().keys({
        password: Joi.string(),
        email: Joi.string().email({ tlds: { allow: ['com'] } }).error(() => Error('Email is not valid')),
    }),
    register: Joi.object().keys({
        password: Joi.string().max(20).required(),
        email: Joi.string().email({ tlds: { allow: ['com'] } }).error(() => Error('Email is not valid')).required(),
        phone: Joi.string().required(),
        name: Joi.string().required(),
        disabled: Joi.string()
    })
};
const checkIfUserExists = async (email) => {
    const user = await User.findOne({ email });
    if (user) return user;
    return false;
}
exports.register = async (req, res, next) => {
    const body = req.body;
    try {
        const validate = userJoiSchema.register.validate(body);
        if (validate.error) {
            throw Error(validate.error);
        }
        if (await checkIfUserExists(body.email)) {
            throw new Error("Already in the sysytem");
        };
        const hash = await bcrypt.hash(body.password, 10);
        body.password = hash;

        const newUser = new User(body);
        await newUser.save();

        const token = generateToken(newUser);

        return res.status(201).send({user:newUser,token:token});
    } catch (error) {
        next(error);
    }
};
exports.login = async (req, res, next) => {
    const body = req.body;
    try {
        const validate = userJoiSchema.login.validate(body);
        if (validate.error) {
            throw Error(validate.error);
        }

        const user = await checkIfUserExists(body.email);
        if (!user || ! await bcrypt.compare(body.password, user.password)) {
            throw new Error('Password or email not valid');
        }
        const token = generateToken(user);
        return res.send({token,user});
    } catch (error) {
        next(error);
    }
};
exports.getUsers = async (req, res, next) => {
    try {
        if(req.type=="owner"&&req.user?.roles=="admin"){
        const users = await User.find({});
        if (!users) return next(new AppError(400, "users not exist"));
        res.status(200).json({
            status: "success",
            users,
        });}
    } catch (error) {
        next(error)
    }

};
exports.updateUser=async(req,res,next)=>{
    try {
        const {body}=req;
        const { id } = req.params;
        const user = await User.updateOne({ id: id },body);
        if (!user) return next(new AppError(400, "users not exist"));
        res.status(200).json({
            status: "success",
            user,
        });
    } catch (error) {
        next(error)
    }
}
exports.deleteUser=async(req,res,next)=>{
    try {
        const { id } = req.params;
        const user = await User.deleteOne({ id: id });
        if (!user) return next(new AppError(400, "users not exist"));
        res.status(200).json({
            status: "success",
            user,
        });
    } catch (error) {
        next(error)
    }
}
exports.getUser = async (req, res, next) => {
    try {
        if (req.user.roles=="admin") {
            const { id } = req.params;
            const user = await User.find({ id: id });
            if (!user) return next(new AppError(400, "users not exist"));
            res.status(200).json({
                status: "success",
                user,
            }); 
        }
     
    } catch (error) {
        next(error)
    }
 
};