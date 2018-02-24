export interface QueueProcessorError<I> extends Error {
  queueItem: I
}
