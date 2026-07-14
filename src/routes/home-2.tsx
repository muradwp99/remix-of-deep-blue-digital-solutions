import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { FramesHero } from "@/components/frames-hero";
import { ScatterHero } from "@/components/scatter-hero";
import { VideoHero } from "@/components/video-hero";

export const Route = createFileRoute("/home-2")({
  head: () => ({
    meta: [
      { title: "Northline Studio — Software you can watch being built" },
      {
        name: "description",
        content: "Scroll-driven film hero and the studio's signature orb hero, side by side.",
      },
      { property: "og:title", content: "Northline Studio — Software you can watch being built" },
      {
        property: "og:description",
        content: "Scroll-driven film hero and the studio's signature orb hero, side by side.",
      },
    ],
  }),
  component: Home2Page,
});

function Home2Page() {
  return (
    <SiteShell>
      {/* Hero 1: scroll-scrubbed image sequence (pinned) */}
      <FramesHero />

      {/* Hero 2: the orb hero swapped in from the main home page.
          pt-20 cancels its baked-in -mt-20 (it no longer sits under the header) */}
      <div className="pt-20">
        <ScatterHero />
      </div>

      {/* Hero 3: shifted from the main home page */}
      <VideoHero />
    </SiteShell>
  );
}
