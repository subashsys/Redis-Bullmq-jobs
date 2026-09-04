import { Worker } from 'bullmq';
import connection from '../redis';

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    console.log(`Processing job: ${job.name}, attempt #${job.attemptsMade + 1}`);
    console.log('Job data:', job.data);

    // Simulation ho hai yo if wala
    if (Math.random() < 0.7) {
      throw new Error('Simulated email service failure');
    }

    console.log(`Sending email to ${job.data.email}...`);
    return { status: 'sent' };
  },
  { connection }
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed on attempt ${job?.attemptsMade}: ${err.message}`);
});

console.log('Email worker is listening...');