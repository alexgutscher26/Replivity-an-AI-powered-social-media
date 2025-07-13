"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useUploadThing } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Download, Image as ImageIcon, Loader2, Upload, Wand2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const captionGeneratorSchema = z.object({
  image: z.instanceof(FileList).optional(),
  platform: z.enum(["twitter", "facebook", "linkedin", "instagram"]),
  tone: z.string().min(1, "Please select a tone"),
  context: z.string().optional(),
  hashtags: z.boolean().default(true),
  mentions: z.boolean().default(false),
});

type CaptionGeneratorFormValues = z.infer<typeof captionGeneratorSchema>;

const PLATFORM_OPTIONS = [
  { value: "twitter", label: "Twitter/X" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
];

const TONE_OPTIONS = [
  "Professional",
  "Casual",
  "Funny",
  "Inspirational",
  "Educational",
  "Promotional",
  "Storytelling",
  "Question",
];

export function AiCaptionGeneratorForm() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        setUploadedImage(res[0].url);
        toast.success("Image uploaded successfully!");
      }
    },
    onUploadError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<CaptionGeneratorFormValues>({
    resolver: zodResolver(captionGeneratorSchema),
    defaultValues: {
      platform: "twitter",
      tone: "Professional",
      context: "",
      hashtags: true,
      mentions: false,
    },
  });

  const generateCaption = api.generations.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedCaption(data.text);
      setIsGenerating(false);
      toast.success("Caption generated successfully!");
    },
    onError: (error) => {
      setIsGenerating(false);
      toast.error(error.message);
    },
  });

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    // Validate file size (4MB limit)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Please upload an image smaller than 4MB.");
      return;
    }

    await startUpload([file]);
  };

  const onSubmit = async (data: CaptionGeneratorFormValues) => {
    if (!uploadedImage) {
      toast.error("Please upload an image first.");
      return;
    }

    setIsGenerating(true);

    // Create a prompt for the AI based on the image and user preferences
    const contextText = data.context ? ` Additional context: ${data.context}` : "";
    const hashtagText = data.hashtags ? " Include relevant hashtags." : " Do not include hashtags.";
    const mentionText = data.mentions ? " Include relevant mentions if appropriate." : " Do not include mentions.";
    
    const platformFormatting = {
      twitter: "Format like a real tweet with natural line breaks. Use 1-2 line breaks for readability. Keep it under 280 characters.",
      facebook: "Format with natural paragraph breaks. Use line breaks to separate thoughts and make it easy to read.",
      linkedin: "Format professionally with clear paragraph structure. Use line breaks to organize ideas logically.",
      instagram: "Format with engaging line breaks. Use emojis and line breaks to create visual appeal and readability."
    };
    
    const prompt = `Generate an engaging ${data.tone.toLowerCase()} caption for this image that will be posted on ${data.platform}. The image is uploaded and available for analysis.${contextText}${hashtagText}${mentionText}

IMPORTANT FORMATTING REQUIREMENTS:
${platformFormatting[data.platform as keyof typeof platformFormatting]}

Make the caption platform-appropriate, engaging, and properly formatted with natural line breaks that make it look like a real social media post.`;

    generateCaption.mutate({
      source: data.platform,
      post: prompt,
      tone: data.tone,
      type: "status",
      link: uploadedImage,
    });
  };

  const copyToClipboard = async () => {
    if (!generatedCaption) return;
    
    try {
      await navigator.clipboard.writeText(generatedCaption);
      toast.success("Caption copied to clipboard.");
    } catch (error) {
      toast.error("Failed to copy caption to clipboard.");
    }
  };

  const downloadCaption = () => {
    if (!generatedCaption) return;
    
    const blob = new Blob([generatedCaption], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "caption.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Upload and Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload & Configure
          </CardTitle>
          <CardDescription>
            Upload an image and configure your caption preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
              {uploadedImage ? (
                <div className="space-y-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUploadedImage(null);
                      setGeneratedCaption(null);
                    }}
                  >
                    Upload Different Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Image
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supports JPG, PNG, GIF up to 4MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Configuration Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PLATFORM_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TONE_OPTIONS.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Context (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide any additional context about the image or desired caption style..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Help the AI understand what you want to emphasize in the caption.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="hashtags"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Hashtags</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mentions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Mentions</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={!uploadedImage || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Caption...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Caption
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Generated Caption */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Generated Caption
          </CardTitle>
          <CardDescription>
            Your AI-generated caption will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedCaption ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="whitespace-pre-wrap">{generatedCaption}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={downloadCaption} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Upload an image and click "Generate Caption" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}