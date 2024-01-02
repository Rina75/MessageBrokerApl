const amqp = require('amqplib');

async function setupNotificationService() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queueName = 'Orderan';

    await channel.assertQueue(queueName, { durable: false });

    console.log(`NotificationService menunggu Orderan Masuk. To exit press CTRL+C`);

    
    channel.consume(queueName, (msg) => {
      if (msg) {
        const orderData = JSON.parse(msg.content.toString());
        const username = orderData.username;
        const bookingCode = orderData.bookingCode;

        console.log('Orderan Masuk \n  Booking Code:', bookingCode, 'Username:', username);
      }
    }, { noAck: true });
  } catch (error) {
    console.error(error);
  }
}

setupNotificationService();
