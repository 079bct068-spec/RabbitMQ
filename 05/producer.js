const amqp = require("amqplib");

async function sendMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "priority_exchange";
  const queue = "priority_queue";
  const routingKey = "priority_key";

  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, {
    durable: true,
    arguments: { "x-max-priority": 10 },
  });
  await channel.bindQueue(queue, exchange, routingKey);

  const data = [
    { message: "Low priority message", priority: 1 },
    { message: "Low priority message", priority: 1 },
    { message: "Medium priority message", priority: 5 },
    { message: "High priority message", priority: 10 },
  ];

  for (const { message, priority } of data) {
    await channel.publish(exchange, routingKey, Buffer.from(message), {
      persistent: true,
      priority,
    });
  }

  console.log("Messages sent with varying priorities");
  setTimeout(() => {
    connection.close();
  }, 500);
}

sendMessage().catch((error) => {
  console.error("Error occurred while sending messages:", error);
});
