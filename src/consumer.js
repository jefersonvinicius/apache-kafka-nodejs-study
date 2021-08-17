const Kafka = require('node-rdkafka');
const http = require('http');

const consumer = Kafka.KafkaConsumer.createReadStream(
  {
    'group.id': 'kafka',
    'metadata.broker.list': 'apache-kafka-nodejs-study_kafka_1:9092',
  },
  { 'auto.offset.reset': 'earliest' },
  {
    topics: 'teste',
  }
);

const messages = [];

consumer.on('error', (err) => {
  console.log('Error: ', err.message);
});

consumer.on('data', (message) => {
  console.log('Message:', message);
  messages.push(message);
});

const server = http.createServer((request, response) => {
  for (const m of messages) {
    response.write(messageFormatted(m));
  }
  response.end();

  function messageFormatted(message) {
    return `${String(message.value)} - At: ${new Date(message.timestamp).toLocaleString()}\n\n`;
  }
});
server.listen(3333, () => console.log('Listening...'));
