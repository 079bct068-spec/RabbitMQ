const ampq = require("amqplib");

const sendMessage = async (routingKey, message) => {
  try {
    const connection = await ampq.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    const exchangeType = "topic";

    await channel.assertExchange(exchange, exchangeType, { durable: true });
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    console.log(
      `Message sent to exchange "${exchange}" with routing key "${routingKey}": ${message}`,
    );

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

sendMessage("order.placed", { orderId: 123, customer: "John Doe" });
sendMessage("payment.processed", { paymentId: 456, status: "success" });
