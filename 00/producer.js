const amqp = require("amqplib");

async function sendMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const exchange = "email_exchange";
    const routingKey = "send_mail";

    const message = {
      to: "zero@gmail.com",
      from: "sender@gmail.com",
      subject: "Hello TP mail",
      body: "This is a test email sent from RabbitMQ producer.",
    };

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue("mail_queue", { durable: true });
    await channel.bindQueue("mail_queue", exchange, routingKey);

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    console.log("Email message sent to RabbitMQ: 📧", message);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Error sending email: 💣", error);
  }
}

sendMail();
