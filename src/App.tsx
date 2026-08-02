import { useState } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "./app/router";
import AeroIntro from "./intro/AeroIntro";

export default function App() {
  const [introFinished, setIntroFinished] = useState(
    sessionStorage.getItem("aeropulse-intro") === "done"
  );

  const finishIntro = () => {
    sessionStorage.setItem("aeropulse-intro", "done");
    setIntroFinished(true);
  };

  return introFinished ? (
    <RouterProvider router={router} />
  ) : (
    <AeroIntro onFinish={finishIntro} />
  );
}