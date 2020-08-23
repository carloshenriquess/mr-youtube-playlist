export function assert(value: unknown): asserts value {
  if (value === undefined) {
    throw new Error('value must be defined');
  }
}

export class TimeoutSink {

  private timeoutIds: NodeJS.Timeout[] = [];

  add(listener: () => any, timeout: number) {
    const timeoutId = setTimeout(listener, timeout);
    if (!this.timeoutIds.includes(timeoutId)) {
      this.timeoutIds.push(timeoutId);
    }
  }

  clearAll() {
    if (this.timeoutIds.length === 0) { return; }
    for (const timeoutId of this.timeoutIds) {
      clearTimeout(timeoutId as any);
    }
    this.timeoutIds = [];
  }
}