const Kafka = require('node-rdkafka');

console.log(Kafka.librdkafkaVersion);

const topic = 'teste';

const producer = new Kafka.Producer({
  'metadata.broker.list': 'apache-kafka-nodejs-study_kafka_1:9092',
});

producer.connect();

producer.on('ready', async () => {
  console.log('Connected!');

  try {
    for (let i = 0; i < 5; i++) {
      producer.produce(topic, null, Buffer.from(`Test message ${i}`), null, Date.now());
      producer.flush(1000);
      await delay(1);
    }
  } catch (error) {
    console.log('Error: ', error.message);
  }

  producer.disconnect();
});

function delay(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), seconds * 100);
  });
}
