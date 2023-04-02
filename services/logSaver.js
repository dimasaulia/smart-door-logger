const prisma = require("../prisma/client");

const logSaver = async (parseData) => {
    const { duid, deviceType, responsesTime } = JSON.parse(parseData);
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
};

module.exports = { logSaver };
