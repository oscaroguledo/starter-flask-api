const { kafkaClient } = require("../config/kafka.config");
const { addmessage } = require('../controller/messageController');
const { Partitioners } = require("kafkajs");

const TOPIC = process.env.KAFKA_TOPIC;

const producerRun = async (message) => {
  const producer = kafkaClient.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  await producer.connect();
  
  await producer.send({
    topic: TOPIC,

    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });
  //await producer.disconnect();
};

// Define a function to call producerRun() asynchronously every 5 seconds
function callProducer(message) {
  setInterval(async () => {
      await producerRun(message);
  }, 5000); // 5000 milliseconds = 5 seconds
}

const consumerRun = async (groupId, topics) => {
    const consumer = kafkaClient.consumer({ groupId: groupId });
    await consumer.connect();
    await consumer.subscribe({ topics: topics, fromBeginning: true  });
  
    const handleMessage = async ({ topic, partition, message }) => {
      console.log(`Topic - ${topic}, Partition - ${partition},`);
      try {
            //addmessage(JSON.parse(message.value.toString()));
            console.log(`Consumer caught ${message.value.toString()} successfully.`);
        } catch (err) {
            console.error(`Error processing ${topic}: `, err);
            pause();
            setTimeout(() => {
                consumer.resume([{ topic: topic }]);
            }, 60 * 1000);
        }
      };
  
    try {
      await consumer.run({
        autoCommit: true,
        eachMessage: handleMessage,
      });
    } catch (error) {
      console.error(error);
    }
  };
  
module.exports = { callProducer, consumerRun };
