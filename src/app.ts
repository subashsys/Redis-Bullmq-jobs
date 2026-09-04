import express from "express";

const app = express();
app.use(express.json());
import { emailQueue } from "./queues/emailQueue";

app.post("/test-email", async (req, res) => {
  const { email, orderId } = req.body;

  const job = await emailQueue.add(
    "order-confirmation",
    { email, orderId },
    {
      attempts: 5, // try up to 5 times total
      backoff: {
        type: "exponential",
        delay: 1000, // 1s, then 2s, then 4s, then 8s between retries
      },
    },
  );

  res.json({ message: "Email job queued", jobId: job.id });
});

export default app;
