import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { TrustMarquee } from "@/components/marketing/trust-marquee";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <TrustMarquee />
        <Features />
        <Pricing />
      </main>
      <SiteFooter />
    </>
  );
}
