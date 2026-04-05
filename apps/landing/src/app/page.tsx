import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { SocialSection } from "@/components/sections/social-section";
import { CtaSection } from "@/components/sections/cta-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <div id="funkcje">
        <FeaturesSection />
      </div>
      <SocialSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}
