import { JSX, useState } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
