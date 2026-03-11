import { createFileRoute } from "@tanstack/react-router";
import { NavigationArea, useUIStore } from "../../store/ui/ui-slice";

export const Route = createFileRoute("/bots")({
  component: Bots,
});

function Bots() {
  const setActiveArea = useUIStore((state) => state.setActiveArea);

  setActiveArea(NavigationArea.BOTS);

  return <div>Bots</div>;
}
