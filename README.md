# Queues & BullMQ

## What is a queue?
A queue is a list of jobs waiting to be processed. A **producer** adds jobs, a **worker** picks them up and processes them — one at a time or in parallel — independently of whoever created the job.

## Problems with a naive/DIY queue (e.g. plain Redis list)

**1. No retries**
If a worker crashes or a job fails mid-processing, the job is just lost. You'd have to write your own retry logic from scratch.

**2. No parallel workers**
A basic list-based queue doesn't manage multiple workers pulling safely at once — no built-in concurrency control, so scaling means writing your own coordination logic.

**3. No delayed or scheduled jobs**
Want to run something in 30 minutes or every night at 2 AM? A plain queue has no concept of "run this later" — you'd need a separate cron/scheduling system.

**4. No job state tracking**
You can't easily tell if a job is waiting, currently running, completed, or failed. Debugging becomes guesswork or manual logging.

**5. No priority or rate limiting**
Every job is treated equally, processed in raw order. No way to say "this job is urgent" or "don't call this API more than 10 times/sec."

**6. Lost jobs on failure**
A job that keeps failing just disappears — there's no dead-letter queue to catch and inspect it later.

**7. No visibility**
No dashboard or easy way to see what's happening across all queues — you're stuck reading logs.

## How BullMQ solves this

- **Automatic retries** with configurable backoff (fixed or exponential) per job
- **Concurrency control** — run multiple jobs in parallel per worker, and run multiple worker processes safely against the same queue
- **Delayed & repeatable jobs** — schedule a job for later, or set up cron-like recurring jobs natively
- **Job state tracking** — every job has a lifecycle (waiting → active → completed/failed) you can query anytime
- **Priorities & rate limiting** — built-in options to prioritize jobs or throttle processing speed
- **Dead-letter behavior** — failed jobs (after all retries) stay inspectable instead of vanishing
- **Bull Board dashboard** — visual UI to monitor queues, jobs, and failures in real time