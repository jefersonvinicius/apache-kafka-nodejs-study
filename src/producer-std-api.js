const Kafka = require('node-rdkafka');
const fs = require('fs');
const { input, delay } = require('./helpers');

console.log(Kafka.librdkafkaVersion);

const key = process.argv.slice(1)[process.argv.indexOf('--key')] ?? null;

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

const logFile = fs.createWriteStream('./delivery-reports.txt', { flags: 'a' });

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
  const deliveryReport = '[DELIVERY REPORT]: ' + formatReport();
  const logLine = `\n\nAt: ${new Date().toLocaleString()}\n${deliveryReport}`;

  console.log(deliveryReport);
  logFile.write(logLine);

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

    producer.produce(topic, null, Buffer.from(message), key, Date.now());
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
    logFile.close();
    process.exit();
  });
});
