const amqp = require("amqplib");

const launchProduct = async (product) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "new_product_launch";
    const exchangeType = "fanout";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    const message = JSON.stringify(product);
    channel.publish(exchange, "", Buffer.from(message), { persistent: true });
    console.log("Product launched:", product);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error launching product:", error);
  }
};

launchProduct({
  id: 1,
  name: "New Smartphone",
  price: 699,
});
