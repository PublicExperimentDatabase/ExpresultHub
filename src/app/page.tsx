"use client";

import { Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Button>
        <Link href={`/experiments/`}>Go to Experiments</Link>
      </Button>
    </main>
  );
}
