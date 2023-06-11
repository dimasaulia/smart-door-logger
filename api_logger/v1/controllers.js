const prisma = require("../../prisma/client");
const { resError, resSuccess } = require("../../services/responseHandler");
const ITEM_LIMIT = 20;
exports.createLog = async (req, res) => {
    try {
        const { duid, deviceType, responsesTime } = req.body;
        let device;
        device = await prisma.device.findUnique({
            where: { device_id: duid },
        });
        if (!device) {
            device = await prisma.device.create({
                data: {
                    device_id: duid,
                    deviceType,
                },
            });
        }

        const data = await prisma.logger.createMany({
            data: responsesTime.map((responseTime) => ({
                responseTime,
                deviceId: device.id,
            })),
        });
        return resSuccess({
            res,
            title: "Success create data log",
            data,
        });
    } catch (error) {
        return resError({ res, title: "Failed to create log", errors: error });
    }
};

exports.list = async (req, res) => {
    try {
        const { cursor, search } = req.query;
        let logList;
        if (!cursor) {
            logList = await prisma.logger.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                take: ITEM_LIMIT,
                select: {
                    id: true,
                    responseTime: true,
                    createdAt: true,
                    Device: {
                        select: {
                            device_id: true,
                            deviceType: true,
                        },
                    },
                },
            });
        }
        if (cursor) {
            logList = await prisma.logger.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                take: ITEM_LIMIT,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                select: {
                    id: true,
                    responseTime: true,
                    createdAt: true,
                    Device: {
                        select: {
                            device_id: true,
                            deviceType: true,
                        },
                    },
                },
            });
        }

        return resSuccess({
            res,
            title: "Success get log data",
            data: logList,
        });
    } catch (error) {
        return resError({ res, title: "Failed get log", errors: error });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.body;
        await prisma.logger.delete({
            where: { id },
        });
        return resSuccess({ res, title: "Success delete data" });
    } catch (error) {
        console.log(error);
        return resError({
            res,
            title: "Failed delete log data",
            errors: error,
        });
    }
};
