const ampq = require("amqplib");

async function sendMail() {
  try {
    const connection = await ampq.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const subscribedUserMailQueue = "subscribed_user_mail_queue";
    const userMailQueue = "user_mail_queue";
    const exchange = "mail_exchange";
    const subscribedUserRoutingKey = "send_mail_to_subscribed_users";
    const userRoutingKey = "send_mail_to_users";

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(subscribedUserMailQueue, { durable: true });
    await channel.assertQueue(userMailQueue, { durable: true });
    await channel.bindQueue(
      subscribedUserMailQueue,
      exchange,
      subscribedUserRoutingKey,
    );
    await channel.bindQueue(userMailQueue, exchange, userRoutingKey);

    const mailToSubscribedUsers = {
      subject: "Hello Subscribed Users!",
      body: "This is a mail for subscribed users.",
    };

    const mailToUsers = {
      subject: "Hello Users!",
      body: "This is a mail for all users.",
    };

    channel.publish(
      exchange,
      subscribedUserRoutingKey,
      Buffer.from(JSON.stringify(mailToSubscribedUsers)),
    );
    console.log("Mail sent to subscribed users.");
    channel.publish(
      exchange,
      userRoutingKey,
      Buffer.from(JSON.stringify(mailToUsers)),
    );
    console.log("Mail sent to all users.");

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Error sending mail:", error);
  }
}

sendMail();
