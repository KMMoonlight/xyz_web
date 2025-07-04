import "./App.css";
import { Toaster } from "sonner";
import routes from "@/routes/index";
import { useRoutes } from "react-router-dom";

function App() {
  const elementRouter = useRoutes(routes);

  return (
    <>
      {elementRouter}
      <Toaster />
    </>
  );
}

export default App;
