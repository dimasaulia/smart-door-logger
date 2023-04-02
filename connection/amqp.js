const amqp = require("amqplib");
const { logSaver } = require("../services/logSaver");
const RabbitSettings = {
    protocol: "amqp",
    hostname: "localhost",
    port: 5672,
    username: "guest",
    password: "guest",
    authMechanism: "AMQPLAIN",
    vhost: "/",
    queue: "smartdoorlogger",
    exchange: "logger",
};

class RabbitConnection {
    constructor() {
        RabbitConnection.createConnection();
        this.connection = null;
        this.channel = null;
    }

    static getInstance() {
        if (!RabbitConnection.instance) {
            RabbitConnection.instance = new RabbitConnection();
        }
        return RabbitConnection.instance;
    }
    //create connection to rabbitmq
    static async createConnection() {
        try {
            this.connection = await amqp.connect(
                // `${RabbitSettings.protocol}://${RabbitSettings.username}:${RabbitSettings.password}@${RabbitSettings.hostname}:${RabbitSettings.port}${RabbitSettings.vhost}`
                `${RabbitSettings.protocol}://${RabbitSettings.hostname}`
            );
            this.channel = await this.connection.createChannel();
            this.channel.assertExchange(RabbitSettings.exchange, "topic", {
                durable: false,
            });
            RabbitConnection.consumeMessage(
                this.channel,
                "logger.save",
                logSaver
            );
            console.log("Connection to RabbitMQ established");
        } catch (error) {
            console.log(error);
        }
    }
    //send message to rabbitmq queue
    static async sendMessage(message, key) {
        try {
            let msg = await this.channel.sendToQueue(key, Buffer.from(message));
            console.log("Message sent to RabbitMQ");
            return msg;
        } catch (error) {
            console.log(error);
        }
    }

    // consume
    static async consumeMessage(ch, key, cb) {
        console.log("LISTENING");
        ch.bindQueue(RabbitSettings.queue, RabbitSettings.exchange, key);
        ch.consume(RabbitSettings.queue, async (msg) => {
            if (msg !== null) {
                console.log(" [x]: Recieved", msg.content.toString());
                ch.ack(msg);

                // EXECUTE Callback Function To Do Something
                cb(msg.content.toString());
            } else {
                console.log("Consumer cancelled by server");
            }
        });
    }
}

module.exports = { RabbitConnection };
