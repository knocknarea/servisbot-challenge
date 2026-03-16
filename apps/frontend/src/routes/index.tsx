import { createFileRoute } from '@tanstack/react-router';
import { Card } from 'flowbite-react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full w-full overflow-auto flex items-center flex-col mt-5">
      <Card className="w-2/3">
        <h5 className="font-bold text-center">Bot Challenge by Adrian Regan</h5>
      </Card>
    </div>
  );
}
