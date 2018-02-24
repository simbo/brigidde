import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { QueueProcessorError } from './queue-processor-error.interface';

export class QueueProcessor<I, O> {

  public readonly input = new Subject<I>();

  private readonly _output = new Subject<O>();
  private readonly _error = new Subject<QueueProcessorError<I>>();
  private readonly _queued = new BehaviorSubject<Array<I>>([]);
  private readonly _processing = new BehaviorSubject<I>(null);

  constructor(
    private processFn: (item: I) => Promise<O>
  ) {
    this.input.subscribe((item) => {
      if (!item) return;
      const items = this._queued.getValue();
      items.push(item);
      this._queued.next(items);
      this.processQueue();
    });
    this._processing.subscribe((item) => {
      if (!item) this.processQueue();
    });
  }

  public get output(): Observable<O> {
    return this._output.asObservable();
  }

  public get error(): Observable<QueueProcessorError<I>> {
    return this._error.asObservable();
  }

  public get queue(): Observable<Array<I>> {
    return this._queued.asObservable();
  }

  public get processing(): Observable<I> {
    return this._processing.asObservable();
  }

  public addItem(item: I): void {
    this.input.next(item);
  }

  private processQueue(): void {
    if (this._processing.getValue() !== null) return;
    const queued = this._queued.getValue();
    if (queued.length === 0) return;
    const item = queued.shift();
    if (!item) return;
    this._processing.next(item);
    this.processItem()
      .then(() => {
        this._queued.next(queued);
        this._processing.next(null);
      })
      .catch((err) => {});
  }

  private async processItem(): Promise<void> {
    const inputItem = this._processing.getValue();
    if (!inputItem) return;
    try {
      const outputItem = await this.processFn(inputItem);
      this._output.next(outputItem);
    } catch (err) {
      err.queueItem = inputItem;
      this._error.next(err as QueueProcessorError<I>);
    }
  }

}
