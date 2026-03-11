import { createFileRoute } from "@tanstack/react-router";
import { NavigationArea, useUIStore } from "../../store/ui/ui-slice";

export const Route = createFileRoute("/logs")({
  component: Logs,
});

function Logs() {
  const setActiveArea = useUIStore((state) => state.setActiveArea);

  setActiveArea(NavigationArea.LOGS);

  return <div>Logs</div>;
}
