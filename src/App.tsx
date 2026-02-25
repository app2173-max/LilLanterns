import { Routes, Route } from "react-router";
import HomePage from "./pages/home";
import BuilderPage from "./pages/builder";
import CaitoStoryPage from "./pages/caito-story";
import UpgradePage from "./pages/upgrade";
import SubscribePage from "./pages/subscribe";
import SubscribeSuccessPage from "./pages/subscribe-success";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="/story/caito-blockchain" element={<CaitoStoryPage />} />
      <Route path="/upgrade" element={<UpgradePage />} />
      <Route path="/subscribe" element={<SubscribePage />} />
      <Route path="/subscribe/success" element={<SubscribeSuccessPage />} />
      {/* CRITICAL: ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
