const Kafka = require('node-rdkafka');
const { input } = require('./helpers');

const stream = Kafka.Producer.createWriteStream(
  {
    'metadata.broker.list': 'apache-kafka-nodejs-study_kafka_1:9092',
  },
  { 'request.required.acks': 1 },
  { topic: 'teste' }
);

stream.on('error', (err) => {
  console.log('Error:', err);
});

async function run() {
  while (true) {
    const message = await input('\nType a message or quit: ');
    if (message.toLowerCase() === 'quit') break;

    const response = stream.write(Buffer.from(message));
    if (response) console.log('Message sent');
    console.log('response:', response);
  }
  stream.close();
}

run();
