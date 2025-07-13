import { Separator } from "@/components/ui/separator";
import { AiCaptionGeneratorForm } from "./_components/ai-caption-generator-form";

export default function AiCaptionGeneratorPage() {
  return (
    <div className="flex-1 space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">AI Caption Generator</h2>
        <p className="text-muted-foreground">
          Upload an image and generate engaging captions for your social media posts using AI.
        </p>
      </div>
      <Separator />
      <AiCaptionGeneratorForm />
    </div>
  );
}