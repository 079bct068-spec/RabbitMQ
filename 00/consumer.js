const amqp = require("amqplib");

async function receiveMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("mail_queue", { durable: true });
    channel.consume("mail_queue", (msg) => {
      if (msg !== null) {
        const messageContent = msg.content;
        const emailMessage = JSON.parse(messageContent);
        console.log("Received email message from RabbitMQ: 📧", emailMessage);
        channel.ack(msg);
      }
    });
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 5000);
  } catch (error) {
    console.error("Error receiving email: 💣", error);
  }
}

receiveMail();
