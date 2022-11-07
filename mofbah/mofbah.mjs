// code from Ryan Carniato's reactive library tutorials:
// https://dev.to/ryansolid/a-hands-on-introduction-to-fine-grained-reactivity-3ndf
// https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p
// https://indepth.dev/posts/1289/solidjs-reactivity-to-rendering

const context = []

function subscribe(running, subscriptions) {
  subscriptions.add(running)
  running.dependencies.add(subscriptions)
}

export function createSignal(value) {
  const subscriptions = new Set()

  const read = () => {
    const running = context[context.length - 1]
    if (running) subscribe(running, subscriptions)
    return value
  }

  const write = (nextValue) => {
    value = nextValue

    for (const sub of [...subscriptions]) {
      sub.execute()
    }
  }
  return [read, write]
}

function cleanup(running) {
  for (const dep of running.dependencies) {
    dep.delete(running)
  }
  running.dependencies.clear()
}

export function createEffect(fn) {
  const execute = () => {
    cleanup(running)
    context.push(running)
    try {
      fn()
    } finally {
      context.pop()
    }
  }

  const running = {
    execute,
    dependencies: new Set(),
  }

  execute()
}

export function createMemo(fn) {
  const [s, set] = createSignal();
  createEffect(() => set(fn()));
  return s;
}


