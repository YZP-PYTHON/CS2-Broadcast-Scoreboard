import { Suspense } from "react";
import ScoreboardClient from "./ScoreboardClient";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ScoreboardClient />
        </Suspense>
    );
}