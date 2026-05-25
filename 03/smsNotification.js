const amqp = require("amqplib");

const smsNotification = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exhchange = "new_product_launch";
    const exchangeType = "fanout";

    await channel.assertExchange(exhchange, exchangeType, { durable: true });

    const q = await channel.assertQueue("", { exclusive: true });
    console.log("Waiting for messages in queue:", q.queue);
    channel.bindQueue(q.queue, exhchange, "");

    channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        const product = JSON.parse(msg.content.toString());
        console.log("SMS Notification: New product launched -", product);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error in SMS Notification:", error);
  }
};

smsNotification();
