import { createFileRoute } from "@tanstack/react-router";
import NftGate from "../components/NftGate";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "The Inner Circle — NFT-Gated Access" },
      { name: "description", content: "Exclusive members-only dashboard protected by NFT ownership verification." },
    ],
  }),
});

function Index() {
  return <NftGate />;
}
