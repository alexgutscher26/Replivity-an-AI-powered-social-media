import { BioProfileOptimizer } from "./_components/bio-profile-optimizer";

/**
 * Renders the Bio & Profile Optimizer page with a header and the BioProfileOptimizer component.
 */
export default function BioOptimizerPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Bio & Profile Optimizer</h1>
        <p className="text-muted-foreground mt-2">
          Create compelling social media bios that capture your brand voice and attract your target audience.
        </p>
      </div>
      <BioProfileOptimizer />
    </div>
  );
}