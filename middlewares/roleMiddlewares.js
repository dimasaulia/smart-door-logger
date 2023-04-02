const { ErrorException, resError } = require("../services/responseHandler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const roleIDIsExist = async (req, res, next) => {
    const { id } = req.params;
    try {
        const roleDetail = await prisma.role.findUnique({
            where: {
                id,
            },
        });

        if (roleDetail === null) {
            throw "Role not exist";
        }

        return next();
    } catch (error) {
        return resError({ res, title: "Something Wrong", errors: error });
    }
};

const roleNameIsExist = async (req, res, next) => {
    const { role } = req.body;
    try {
        const roleDetail = await prisma.role.findUnique({
            where: {
                name: role,
            },
        });

        if (roleDetail === null) {
            throw "Cant find the role";
        }

        return next();
    } catch (error) {
        return resError({
            res,
            title: "Something Wrong",
            errors: error,
            code: 403,
        });
    }
};

const roleNameIsNotExist = async (req, res, next) => {
    const { role } = req.body;
    try {
        const roleDetail = await prisma.role.findUnique({
            where: {
                name: role,
            },
        });

        if (roleDetail !== null) {
            throw "Role already exist";
        }

        return next();
    } catch (error) {
        return resError({
            res,
            title: "Something Wrong",
            errors: error,
            code: 403,
        });
    }
};

module.exports = { roleIDIsExist, roleNameIsNotExist, roleNameIsExist };
