const Kafka = require('node-rdkafka');

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

  try {
    const list = Array(5)
      .fill(null)
      .map((_, i) => i);

    for await (const i of list) {
      producer.produce(topic, null, Buffer.from(`Test message ${i + 1}`), null, Date.now());
      producer.flush(1000);
      await delay(1);
    }
  } catch (error) {
    console.log('Error: ', error.message);
  }

  producer.disconnect();
});

producer.on('event.error', (error) => {
  console.log('Error on producer: ', error.message);
});

function delay(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), seconds * 100);
  });
}
