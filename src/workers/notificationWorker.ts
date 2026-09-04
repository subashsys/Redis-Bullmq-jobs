import { Worker } from 'bullmq';
import connection from '../redis';

const notificationWorker = new Worker(
  'notificationQueue',
  async (job) => {
    console.log(`Processing job: ${job.name}, attempt #${job.attemptsMade + 1}`);
    console.log('Job data:', job.data);

    console.log(`Sending push notification to user ${job.data.userId}: "${job.data.message}"`);
    return { status: 'sent' };
  },
  { connection }
);

notificationWorker.on('completed', (job) => {
  console.log(`Notification job ${job.id} completed`);
});

notificationWorker.on('failed', (job, err) => {
  console.log(`Notification job ${job?.id} failed: ${err.message}`);
});

console.log('Notification worker is listening...');