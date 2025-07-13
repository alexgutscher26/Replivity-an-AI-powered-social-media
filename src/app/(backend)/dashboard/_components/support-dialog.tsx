/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import {
  supportFormSchema,
  type SupportFormValues,
} from "@/utils/schema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Loader2, 
  Send, 
  AlertCircle, 
  CheckCircle2,
  HelpCircle,
  Bug,
  Lightbulb,
  Settings
} from "lucide-react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SupportDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional initial values for the form */
  initialValues?: Partial<SupportFormValues>;
  /** Optional callback when support request is successfully sent */
  onSuccess?: () => void;
  /** Optional priority level for the support request */
  priority?: "low" | "medium" | "high";
}

const SUPPORT_CATEGORIES = [
  { id: "bug", label: "Bug Report", icon: Bug, color: "bg-red-100 text-red-800" },
  { id: "feature", label: "Feature Request", icon: Lightbulb, color: "bg-blue-100 text-blue-800" },
  { id: "help", label: "General Help", icon: HelpCircle, color: "bg-green-100 text-green-800" },
  { id: "account", label: "Account Issue", icon: Settings, color: "bg-purple-100 text-purple-800" },
] as const;

type SupportCategory = typeof SUPPORT_CATEGORIES[number]["id"];

/**
 * Support Dialog Component
 *
 * This component renders a dialog for users to submit support requests. It includes fields for subject and message,
 * category selection, and priority indication. The form is validated both client-side and server-side, with appropriate
 * error handling and success notifications. The dialog can be opened or closed based on the `open` prop, and it resets
 * its state when opening or closing.
 *
 * @param open - A boolean indicating whether the dialog should be open or closed.
 * @param onOpenChange - A callback function to handle changes in the open state of the dialog.
 * @param initialValues - Initial values for the form fields (optional).
 * @param onSuccess - A callback function to execute upon successful submission of a support request (optional).
 * @param priority - The priority level of the support request, defaulting to "medium" if not provided.
 */
export default function SupportDialog({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
  priority = "medium",
}: SupportDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | null>(null);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      subject: initialValues?.subject ?? "",
      message: initialValues?.message ?? "",
    },
    mode: "onChange", // Enable real-time validation
  });

  // Enhanced form validation with better UX
  const formValidation = useMemo(() => {
    const subject = form.watch("subject")?.trim() || "";
    const message = form.watch("message")?.trim() || "";
    
    return {
      isSubjectValid: subject.length > 0,
      isMessageValid: message.length >= 10,
      subjectLength: subject.length,
      messageLength: message.length,
      isFormValid: subject.length > 0 && message.length >= 10,
    };
  }, [form.watch("subject"), form.watch("message")]);

  // Reset form when dialog opens/closes or initial values change
  useEffect(() => {
    if (open) {
      form.reset({
        subject: initialValues?.subject ?? "",
        message: initialValues?.message ?? "",
      });
      setSelectedCategory(null);
      setIsSubmitAttempted(false);
    }
  }, [open, initialValues, form]);

  const handleSuccess = useCallback(() => {
    toast.success("Support request sent successfully", {
      description: "We'll get back to you as soon as possible.",
      duration: 5000,
      icon: <CheckCircle2 className="h-4 w-4" />,
    });

    form.reset();
    setSelectedCategory(null);
    setIsSubmitAttempted(false);
    onOpenChange?.(false);
    onSuccess?.();
  }, [form, onOpenChange, onSuccess]);

  const handleError = useCallback((error: unknown) => {
    console.error("Support request failed:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred";
    
    toast.error("Failed to send support request", {
      description: errorMessage,
      duration: 7000,
      icon: <AlertCircle className="h-4 w-4" />,
      action: {
        label: "Try again",
        onClick: () => {
          const formData = form.getValues();
          if (formData.subject && formData.message) {
            mail.mutate({
              subject: formData.subject.trim(),
              message: formData.message.trim(),
              category: selectedCategory,
            });
          }
        },
      },
    });
  }, [form, selectedCategory]);

  const mail = api.settings.sendSupportMail.useMutation({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const onSubmit = useCallback(async (formData: SupportFormValues) => {
    setIsSubmitAttempted(true);
    
    // Additional client-side validation with better error messages
    if (!formData.subject.trim()) {
      form.setError("subject", { 
        message: "Subject is required and cannot be empty" 
      });
      return;
    }
    
    if (!formData.message.trim()) {
      form.setError("message", { 
        message: "Message is required and cannot be empty" 
      });
      return;
    }

    if (formData.message.trim().length < 10) {
      form.setError("message", { 
        message: "Please provide more details (at least 10 characters)" 
      });
      return;
    }

    // Enhanced mutation with additional context
    mail.mutate({
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      category: selectedCategory,
    });
  }, [form, mail, selectedCategory]);

  const handleClose = useCallback(() => {
    if (mail.isPending) {
      toast.warning("Please wait for the request to complete", {
        description: "Your support request is being sent...",
      });
      return;
    }
    onOpenChange?.(false);
  }, [mail.isPending, onOpenChange]);

  const handleCategorySelect = useCallback((category: SupportCategory) => {
    setSelectedCategory(category);
    
    // Auto-populate subject prefix based on category
    const currentSubject = form.getValues("subject");
    if (!currentSubject) {
      const categoryLabel = SUPPORT_CATEGORIES.find(c => c.id === category)?.label;
      form.setValue("subject", `${categoryLabel}: `);
    }
  }, [form]);

  /**
   * Determines the color class based on the current character count relative to specified max and min values.
   *
   * The function checks if the current count is below an optional minimum threshold, returning 'text-red-500' if true.
   * If the current count exceeds 90% of the maximum threshold, it returns 'text-yellow-600'.
   * Otherwise, it defaults to 'text-muted-foreground'.
   *
   * @param {number} current - The current character count.
   * @param {number} max - The maximum allowable character count.
   * @param {number} [min] - An optional minimum threshold for the character count.
   */
  const getCharacterCountColor = (current: number, max: number, min?: number) => {
    if (min && current < min) return "text-red-500";
    if (current > max * 0.9) return "text-yellow-600";
    return "text-muted-foreground";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        aria-describedby="support-dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Contact Support
          </DialogTitle>
          <DialogDescription id="support-dialog-description">
            Need assistance? Send us a detailed message and we&apos;ll respond as quickly as possible.
            Please include any relevant information to help us assist you better.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6"
            noValidate
          >
            {/* Category Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Category <span className="text-muted-foreground">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SUPPORT_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        selectedCategory === category.id && category.color
                      )}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {category.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Subject <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of your issue (e.g., Login problem, Feature request)"
                      disabled={mail.isPending}
                      maxLength={100}
                      aria-describedby="subject-description"
                      className={cn(
                        isSubmitAttempted && !formValidation.isSubjectValid && "border-red-500"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <div 
                    id="subject-description" 
                    className={cn(
                      "text-xs flex justify-between",
                      getCharacterCountColor(formValidation.subjectLength, 100)
                    )}
                  >
                    <span>
                      {formValidation.isSubjectValid ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500 inline mr-1" />
                      ) : (
                        isSubmitAttempted && <AlertCircle className="h-3 w-3 text-red-500 inline mr-1" />
                      )}
                      Subject is {formValidation.isSubjectValid ? "valid" : "required"}
                    </span>
                    <span>{formValidation.subjectLength}/100 characters</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Message <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce the problem, or specific questions you have."
                      className={cn(
                        "min-h-[140px] resize-none",
                        isSubmitAttempted && !formValidation.isMessageValid && "border-red-500"
                      )}
                      disabled={mail.isPending}
                      maxLength={2000}
                      aria-describedby="message-description"
                      {...field}
                    />
                  </FormControl>
                  <div 
                    id="message-description" 
                    className={cn(
                      "text-xs flex justify-between",
                      getCharacterCountColor(formValidation.messageLength, 2000, 10)
                    )}
                  >
                    <span>
                      {formValidation.isMessageValid ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500 inline mr-1" />
                      ) : (
                        isSubmitAttempted && <AlertCircle className="h-3 w-3 text-red-500 inline mr-1" />
                      )}
                      Message needs at least 10 characters
                    </span>
                    <span>{formValidation.messageLength}/2000 characters</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Priority indicator */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Priority: 
                <Badge variant="outline" className="ml-2 capitalize">
                  {priority}
                </Badge>
              </span>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={mail.isPending}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  mail.isPending || 
                  form.formState.isSubmitting ||
                  !formValidation.isFormValid
                }
                className="w-full sm:w-auto"
              >
                {mail.isPending || form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Support Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
