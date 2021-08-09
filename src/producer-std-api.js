const Kafka = require('node-rdkafka');
const { input, delay } = require('./helpers');

console.log(Kafka.librdkafkaVersion);

const topic = 'teste';

const producer = new Kafka.Producer(
  {
    'metadata.broker.list': 'apache-kafka-nodejs-study_kafka_1:9092',
    dr_msg_cb: true,
  },
  {
    'request.required.acks': 1,
  }
);

producer.connect();

producer.on('event.error', (error) => {
  console.log('Error on producer: ', error.message);
});

producer.on('disconnected', () => {
  console.log('Producer disconnected');
});

producer.on('delivery-report', (error, report) => {
  if (error) {
    console.log('[DELIVERY REPORT]: Error -> ' + error.message);
    return;
  }
  console.log('[DELIVERY REPORT]: ' + formatReport());

  function formatReport() {
    return `
    message: ${Buffer.from(report.value).toString()}
    partition: ${report.partition}
    offset: ${report.offset}`;
  }
});

producer.on('ready', async () => {
  console.log('Connected!');

  while (true) {
    const message = await input('\nType a message or quit: ');
    if (message.toLowerCase() === 'quit') break;

    producer.produce(topic, null, Buffer.from(message), null, Date.now());
    producer.flush(1000);
    await delay(1);
  }

  producer.disconnect((error, data) => {
    if (error) {
      console.log(error);
    }
    const metrics = {
      'Connection Opened': new Date(data.connectionOpened).toUTCString(),
    };
    console.table(metrics);
    process.exit();
  });
});
