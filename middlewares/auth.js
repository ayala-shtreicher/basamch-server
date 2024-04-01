const { Owner } = require("../models/owner.model");
const { User } = require("../models/user.model");
const { decodeToken } = require("../utils/jwt");

exports.auth = (role) => {
    return async function (req, res, next) {
        let token = req.headers["authorization"];
        if (!token) return res.sendStatus(401);
        token = token.split(" ")[1];
        try {
            const payload = decodeToken(token);
            // console.log(payload);
            // if (role && payload._doc.role !== role) return res.sendStatus(401);
            res.locals.userId = payload._doc.id;
            const id = payload._doc.id;
            const user = await User.findById(id);
            if (!user) {
                const owner = await Owner.findById(id);
                req.type = "owner";
                if (!owner) {
                    return next(new AppError(403, "Please login, no user"));
                }
                req.user=owner;
            } else {
                req.type = "user";
                req.user = user;
            }
            next();
        } catch (error) {
            next(error);
        }
    }
};

// exports.authNoPermistion = async (req, res, next) => {
//     let token = req.headers["authorization"];
//     if (!token) return res.sendStatus(401);
//     token = token.split(" ")[1];
//     try {
//         const payload = decodeToken(token);
//         // console.log(payload);
//         // req.userId = payload?._doc?.id;
//         res.locals.userId = payload._doc.id;
//         console.log(payload._doc.id);
//         next();
//     } catch (error) {
//         next(error);
//     }
// }
