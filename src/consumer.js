const Kafka = require('node-rdkafka');
const http = require('http');

const consumer = Kafka.KafkaConsumer.createReadStream(
  {
    'group.id': 'kafka',
    'metadata.broker.list': 'apache-kafka-nodejs-study_kafka_1:9092',
  },
  {},
  {
    topics: 'teste',
  }
);

const messages = [];

consumer.on('data', (message) => {
  console.log('Message:', message);
  messages.push(message);
});

const server = http.createServer((request, response) => {
  for (const m of messages) {
    response.write(String(m.value) + '\n');
  }
  response.end();
});
server.listen(3333, () => console.log('Listening...'));
