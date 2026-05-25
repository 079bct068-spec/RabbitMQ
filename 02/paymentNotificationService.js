const amqp = require("amqplib");
const receiveMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    const exchangeType = "topic";
    const queue = "payment_queue";

    await channel.assertExchange(exchange, exchangeType, { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, "payment.*");
    console.log(`Waiting for messages in queue "${queue}"...`);
    channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          const messageContent = JSON.parse(msg.content.toString());
          console.log(`Received message: ${messageContent}`);
          channel.ack(msg);
        }
      },
      { noAck: false },
    );
  } catch (error) {
    console.error("Error receiving message:", error);
  }
};

receiveMessage();
