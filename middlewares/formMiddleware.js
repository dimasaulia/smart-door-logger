const { validationResult } = require("express-validator");
const { resError, ErrorException } = require("../services/responseHandler");

const formChacker = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (errors.isEmpty()) return next();
        const errorResponse = [];
        errors.errors.forEach((error) => {
            errorResponse.push(error.msg);
        });
        throw `${errorResponse[0]}`;
    } catch (error) {
        return resError({
            res,
            title: "Something wrong",
            errors: error,
            code: 403,
        });
    }
};

module.exports = { formChacker };
