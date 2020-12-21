export function assert(value: unknown): asserts value {
  if (value === undefined) {
    throw new Error('value must be defined');
  }
}

export class TimeoutSink {

  private timeoutIds: NodeJS.Timeout[] = [];

  set sink(timeoutId: NodeJS.Timeout) {
    // const timeoutId = setTimeout(listener, timeout);
    if (!this.timeoutIds.includes(timeoutId)) {
      this.timeoutIds.push(timeoutId);
    }
  }

  clear() {
    if (this.timeoutIds.length === 0) { return; }
    for (const timeoutId of this.timeoutIds) {
      clearTimeout(timeoutId as any);
    }
    this.timeoutIds = [];
  }
}