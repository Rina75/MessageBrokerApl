const amqp = require('amqplib');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

rl.question('Masukkan username: ', async (username) => {
  rl.question('Masukkan barang orderan: ', async (item) => {
    rl.close();

    
    const bookingCode = generateRandomString(6);

    const orderData = {
      bookingCode: bookingCode,
      username: username,
      item: item
    };

    

    try {
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();

      const q = 'Orderan';
      const msg = JSON.stringify(orderData);

      
      await channel.assertQueue(q, { durable: false });

      
      channel.sendToQueue(q, Buffer.from(msg));

      console.log('Orderan terkirim:', msg);

      
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error(error);
    }
  });
});

