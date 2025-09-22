import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
const worker = new Worker(new URL("../../worker.js", import.meta.url));

function Login() {
   const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values:any) => {
  //       let sum = 0;
  // for (let i = 0; i < 1000_000_000; i++) {
  //   sum += i;
  //   }
  //   console.log(sum)
      console.log("Form Values:", values);
      login(values);
      navigate("/dashboard");
    },
  });
 const workerRef = useRef<any>(null);

  const handleCompute = () => {
    setLoading(true);
    setResult(null);

    // Always create a fresh worker
    workerRef.current = new Worker(new URL("../../worker.js", import.meta.url));

    // Listen for messages
    workerRef.current.onmessage = (event) => {
      console.log(event)
      setResult(event.data);
      setLoading(false);

      // Kill worker after use to free resources
      workerRef?.current?.terminate();
      workerRef.current = null;
    };

    // Send task
    workerRef.current.postMessage(1000_000_000);
  };
  
  //
  // PushNotification.js
import React from "react";

async function subscribeUser() {
  // 1. Register service worker
  const reg = await navigator.serviceWorker.register("/sw.js");

  // 2. Ask permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Permission denied for notifications");
    return;
  }

  // 3. Subscribe to push
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array("<VAPID_PUBLIC_KEY>"),
  });

  // 4. Send to backend
  await fetch("/api/save-subscription", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: { "Content-Type": "application/json" },
  });

  alert("Subscribed to push notifications!");
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// export default function PushNotification() {
//   return 
// }

  return (
    <div className="flex mt-5 items-center justify-center">
      <div className="p-8 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl text-black font-bold mb-6 text-center">
          Login to Your Account
        </h2>

        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-red-500 text-sm">{formik.errors.email as string}</p>// error for email
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange} //onchange
              onBlur={formik.handleBlur}
              className="mt-1 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 text-sm">{formik.errors.password as string}</p> //error for password
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
          <button onClick={handleCompute} disabled={loading}>
        {loading ? "Calculating..." : "Run Heavy Task"}
      </button>
      {result !== null && <p>Result: {result}</p>}
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
        <button onClick={subscribeUser}>Enable Push Notifications</button>;
      </div>
    </div>
  );
}

export default Login;
