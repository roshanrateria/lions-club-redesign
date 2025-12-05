import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { insertDonationSchema } from "@shared/schema";
import { Info, Send } from "lucide-react";
import { z } from "zod";

interface CertificateFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = insertDonationSchema.extend({
  proof: z.any().refine((files) => files?.[0], "Proof of payment is required"),
}).omit({ proofUrl: true });

type DonationFormData = z.infer<typeof formSchema>;

export default function CertificateForm({ isOpen, onClose }: CertificateFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      amount: 0,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/donations", {
        method: "POST",
        body: data,
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Form submitted successfully!",
        description: "You will receive your 80G certificate within 48 working hours.",
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("mobile", data.mobile);
    formData.append("email", data.email);
    formData.append("amount", data.amount.toString());
    
    if (data.proof?.[0]) {
      formData.append("proof", data.proof[0]);
    }

    submitMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-lions-blue mb-2">
            80G Tax Certificate Form
          </DialogTitle>
          <p className="text-center text-gray-600">Fill out this form to receive your 80G certificate</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number *</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation Amount *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Proof of Payment *
              </label>
              <Input 
                type="file" 
                accept="image/*,.pdf"
                {...(form.register as any)('proof')}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload screenshot or receipt of your donation
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mt-6">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  <strong>You will receive your 80G certificate within 48 working hours</strong> after form submission and payment verification.
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-lions-gold hover:bg-lions-gold/90 text-white"
                disabled={submitMutation.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                {submitMutation.isPending ? "Submitting..." : "Submit Form"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
