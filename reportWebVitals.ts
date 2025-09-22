function sendMetric(metric: any) {
  const body = JSON.stringify(metric);
  const url = "https://example.com/analytics";

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: "POST", keepalive: true });
  }
}

export default function reportWebVitals(callback?: (metric: any) => void) {
  if (callback && typeof callback === "function") {
    // here you would pass real metrics (e.g., from web-vitals library)
    const dummyMetric = { name: "CLS", value: 0.02 };
    callback(dummyMetric);
    sendMetric(dummyMetric); // also send to your backend
  }
}
