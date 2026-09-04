import { Queue } from 'bullmq';
import connection from '../redis';

export const notificationQueue = new Queue('notificationQueue', { connection });