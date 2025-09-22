// worker.js
/* eslint-disable no-restricted-globals */
self.onmessage = function (event) {
  const limit = event.data;
  console.log("hi")

  // Heavy computation: sum of numbers from 0 to limit
  let sum = 0;
  for (let i = 0; i < limit; i++) {
    sum += i;
  }
    console.log("hello")

  // Send result back to main thread
  self.postMessage(sum);
};
