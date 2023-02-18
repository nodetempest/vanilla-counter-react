import * as React from 'react';

class Counter {
  value = 0;
  events = new EventTarget();

  increment() {
    this.value = this.value + 1;
    this.emit();
  }

  decrement() {
    this.value = this.value - 1;
    this.emit();
  }

  subscribe(listener: (nextValue: number) => void) {
    this.events.addEventListener('change', (event: CustomEvent<number>) =>
      listener(event.detail)
    );
  }

  unsubscribe(listener: (nextValue: number) => void) {
    this.events.removeEventListener('change', (event: CustomEvent<number>) =>
      listener(event.detail)
    );
  }

  emit() {
    this.events.dispatchEvent(
      new CustomEvent('change', { detail: this.value })
    );
  }
}

const counter = new Counter();

const useCounter = () => {
  const [state, setState] = React.useState<number>(counter.value);

  React.useEffect(() => {
    counter.subscribe(setState);
    return () => counter.unsubscribe(setState);
  }, []);

  return {
    count: state,
    increment: () => counter.increment(),
    decrement: () => counter.decrement(),
  };
};

const Controls = () => {
  const counter = useCounter();

  return (
    <div>
      <button onClick={() => counter.increment()}>+</button>
      <button onClick={() => counter.decrement()}>-</button>
    </div>
  );
};

const Display = () => {
  const counter = useCounter();

  return <h3>{counter.count}</h3>;
};

const OtherDisplay = () => {
  const counter = useCounter();

  return <h3>{counter.count}</h3>;
};

const App = () => {
  return (
    <div>
      <Display />
      <Controls />
      <OtherDisplay />
    </div>
  );
};

export default App;
