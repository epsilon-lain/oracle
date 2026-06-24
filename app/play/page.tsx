import { AuthGate } from "@/components/AuthGate";
import { PlayRoom } from "@/components/PlayRoom";
import { createInitialGameState } from "@/lib/mock-gm";

export default function PlayPage() {
  return (
    <AuthGate nextPath="/play">
      <PlayRoom initialState={createInitialGameState()} />
    </AuthGate>
  );
}
