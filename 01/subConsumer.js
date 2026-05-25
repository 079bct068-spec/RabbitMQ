const amqp = require("amqplib");

async function receiveMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const subscribedUserMailQueue = "subscribed_user_mail_queue";
    await channel.assertQueue(subscribedUserMailQueue, { durable: true });

    console.log("Waiting for messages in queues...");
    channel.consume(subscribedUserMailQueue, (msg) => {
      if (msg !== null) {
        const mail = JSON.parse(msg.content.toString());
        console.log("Received mail for subscribed users:", mail);
        channel.ack(msg);
      } else {
        console.log("No messages in subscribed user mail queue.");
      }
    });
  } catch (error) {
    console.error("Error receiving mail:", error);
  }
}

receiveMail();
