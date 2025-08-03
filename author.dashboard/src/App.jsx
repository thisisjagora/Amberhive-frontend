import { Toaster } from "./components/ui/sonner";
import AppRoute from "./routes/AppRoute";

function App() {
  return (
    <div>
      
      <AppRoute />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
