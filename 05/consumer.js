const amqp = require("amqplib");

async function consumeMessages() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "priority_queue";

    await channel.assertQueue(queue, {
      durable: true,
      arguments: { "x-max-priority": 10 },
    });

    await channel.prefetch(1);
    console.log("Waiting for messages in the queue...");
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const messageContent = msg.content.toString();
        const priority = msg.properties.priority || "N/A";
        console.log(
          `Received message: "${messageContent}" with priority: ${priority}`,
        );
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error occurred while consuming messages:", error);
  }
}

consumeMessages().catch((error) => {
  console.error("Error occurred in consumeMessages:", error);
});
