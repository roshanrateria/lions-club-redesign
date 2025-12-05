import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Trash2,
  Edit,
  Plus,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Eye,
  Clock,
  Settings,
  BarChart3,
  Camera,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
} from "lucide-react";
import type { Post, Donation } from "@shared/schema";
import { z } from "zod";

// Import the new schema for social media publications
import { insertSocialMediaPublicationSchema } from "@shared/schema";
import type { SocialMediaPublication } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const postFormSchema = insertPostSchema
  .extend({
    coverImage: z.any().optional(),
    additionalImages: z.any().optional(),
  })
  .omit({ coverImageUrl: true, additionalImages: true });

const socialMediaFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  linkUrl: z.string().url("Please enter a valid URL"),
  image: z.any().optional(),
});

type PostFormData = z.infer<typeof postFormSchema>;
type SocialMediaFormData = z.infer<typeof socialMediaFormSchema>;

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [proofImageUrl, setProofImageUrl] = useState<string | null>(null);
  const [isProofDialogOpen, setIsProofDialogOpen] = useState(false);
  const [isSocialMediaDialogOpen, setIsSocialMediaDialogOpen] = useState(false);
  const [editingSocialMedia, setEditingSocialMedia] = useState<SocialMediaPublication | null>(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const { toast } = useToast();

  // Utility function to handle authentication errors
  const handleAuthError = (response: Response) => {
    if (response.status === 401) {
      setIsLoggedIn(false);
      toast({
        title: "Session Expired",
        description: "Please log in again to continue",
        variant: "destructive",
      });
      return true;
    }
    return false;
  };

  // Enhanced fetch function with auth error handling
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      credentials: 'include'
    });

    if (handleAuthError(response)) {
      throw new Error('Authentication required');
    }

    return response;
  };

  // Check authentication status on component mount
  useQuery({
    queryKey: ["/api/admin/status"],
    queryFn: async () => {
      const response = await fetch("/api/admin/status", {
        credentials: 'include' // Include session cookie
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.isAuthenticated);
        return data;
      }
      return { isAuthenticated: false };
    },
  });

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const postForm = useForm({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
    },
  });

  const socialMediaForm = useForm({
    resolver: zodResolver(socialMediaFormSchema),
    defaultValues: {
      title: "",
      linkUrl: "",
    },
  });

  const changePasswordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include' // Include session cookie
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      return response.json();
    },
    onSuccess: () => {
      setIsLoggedIn(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin portal!",
      });
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: 'include'
      });
      return response.json();
    },
    onSuccess: () => {
      setIsLoggedIn(false);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    },
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const response = await authenticatedFetch("/api/posts");
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
  });

  const { data: donations, isLoading: donationsLoading } = useQuery({
    queryKey: ["/api/donations"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const response = await authenticatedFetch("/api/donations");
      if (!response.ok) throw new Error('Failed to fetch donations');
      return response.json();
    },
  });

  const { data: socialMediaPublications, isLoading: socialMediaLoading } = useQuery({
    queryKey: ["/api/social-media-publications"],
    enabled: isLoggedIn,
    queryFn: async () => {
      const response = await authenticatedFetch("/api/social-media-publications");
      if (!response.ok) throw new Error('Failed to fetch social media publications');
      return response.json();
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: data,
        credentials: 'include', // Add credentials
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setIsPostDialogOpen(false);
      postForm.reset();
      toast({ title: "Success", description: "Post created successfully!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        body: data,
        credentials: 'include', // Add credentials
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setIsPostDialogOpen(false);
      setEditingPost(null);
      postForm.reset();
      toast({ title: "Success", description: "Post updated successfully!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        credentials: 'include', // Add credentials
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({ title: "Success", description: "Post deleted successfully!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const updateDonationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/donations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: 'include', // Add credentials
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      toast({ title: "Success", description: "Donation status updated!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const createSocialMediaMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/social-media-publications", {
        method: "POST",
        body: data,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to create social media publication");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-media-publications"] });
      setIsSocialMediaDialogOpen(false);
      socialMediaForm.reset();
      toast({ title: "Success", description: "Social media publication created successfully!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create social media publication",
        variant: "destructive",
      });
    },
  });

  const updateSocialMediaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await fetch(`/api/social-media-publications/${id}`, {
        method: "PUT",
        body: data,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to update social media publication");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-media-publications"] });
      setIsSocialMediaDialogOpen(false);
      setEditingSocialMedia(null);
      socialMediaForm.reset();
      toast({ title: "Success", description: "Social media publication updated successfully!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update social media publication",
        variant: "destructive",
      });
    },
  });

  const deleteSocialMediaMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/social-media-publications/${id}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to delete social media publication");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-media-publications"] });
      toast({ title: "Success", description: "Social media publication deleted successfully!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete social media publication",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof changePasswordSchema>) => {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }

      return response.json();
    },
    onSuccess: () => {
      setIsChangePasswordDialogOpen(false);
      changePasswordForm.reset();
      toast({ title: "Success", description: "Password changed successfully!" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleChangePassword = (data: z.infer<typeof changePasswordSchema>) => {
    changePasswordMutation.mutate(data);
  };

  const handleLogin = (data: { username: string; password: string }) => {
    loginMutation.mutate(data);
  };

  const handlePostSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("date", data.date.toISOString());

      // Handle cover image
      if (data.coverImage?.[0]) {
        formData.append("coverImage", data.coverImage[0]);
      }

      // Handle additional images - get them from the actual input element
      const additionalImagesInput = document.querySelector(
        'input[name="additionalImages"]',
      ) as HTMLInputElement;
      if (
        additionalImagesInput &&
        additionalImagesInput.files &&
        additionalImagesInput.files.length > 0
      ) {
        for (let i = 0; i < additionalImagesInput.files.length; i++) {
          formData.append("additionalImages", additionalImagesInput.files[i]);
        }
      }

      const url = editingPost ? `/api/posts/${editingPost.id}` : "/api/posts";
      const method = editingPost ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
        credentials: 'include', // Add credentials
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save post: ${errorText}`);
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setIsPostDialogOpen(false);
      postForm.reset();
      setEditingPost(null);

      // Clear the file inputs
      const coverInput = document.querySelector(
        'input[name="coverImage"]',
      ) as HTMLInputElement;
      const additionalInput = document.querySelector(
        'input[name="additionalImages"]',
      ) as HTMLInputElement;
      if (coverInput) coverInput.value = "";
      if (additionalInput) additionalInput.value = "";
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    postForm.reset({
      title: post.title,
      description: post.description,
      date: new Date(post.date),
    });
    setIsPostDialogOpen(true);
  };

  const handleAddPost = () => {
    setEditingPost(null);
    postForm.reset({
      title: "",
      description: "",
      date: new Date(),
    });
    setIsPostDialogOpen(true);
  };

  const handleViewProof = (proofUrl: string) => {
    setProofImageUrl(proofUrl);
    setIsProofDialogOpen(true);
  };

  const handleSocialMediaSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("linkUrl", data.linkUrl);

      // Check if image is provided for new publications
      if (!editingSocialMedia && !data.image?.[0]) {
        toast({
          title: "Error",
          description: "Please select an image for the publication",
          variant: "destructive",
        });
        return;
      }

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      if (editingSocialMedia) {
        updateSocialMediaMutation.mutate({ id: editingSocialMedia.id, data: formData });
      } else {
        createSocialMediaMutation.mutate(formData);
      }
    } catch (error) {
      console.error("Error saving social media publication:", error);
      toast({
        title: "Error",
        description: "Failed to save publication",
        variant: "destructive",
      });
    }
  };

  const handleEditSocialMedia = (publication: SocialMediaPublication) => {
    setEditingSocialMedia(publication);
    socialMediaForm.reset({
      title: publication.title,
      linkUrl: publication.linkUrl,
    });
    setIsSocialMediaDialogOpen(true);
  };

  const handleAddSocialMedia = () => {
    setEditingSocialMedia(null);
    socialMediaForm.reset({
      title: "",
      linkUrl: "",
    });
    setIsSocialMediaDialogOpen(true);
  };

  // Stats calculation
  const totalPosts = posts?.length || 0;
  const totalDonations = donations?.length || 0;
  const approvedDonations = donations?.filter((d: Donation) => d.status === "approved")?.length || 0;
  const pendingDonations = donations?.filter((d: Donation) => d.status === "pending")?.length || 0;
  const totalDonationAmount = donations?.reduce((sum: number, d: Donation) =>
    d.status === "approved" ? sum + parseFloat(d.amount.toString()) : sum, 0) || 0;
  const totalSocialMediaPublications = socialMediaPublications?.length || 0;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-lions-blue to-blue-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-lions-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Lions Club
            </h1>
            <p className="text-blue-100 text-lg">Kolkata IEM Admin Portal</p>
          </div>
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-lions-blue mb-2">
                Welcome Back
              </CardTitle>
              <p className="text-gray-600">Sign in to manage your community platform</p>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-6"
                >
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-12 border-2 border-gray-200 focus:border-lions-blue transition-colors"
                            placeholder="Enter your username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            className="h-12 border-2 border-gray-200 focus:border-lions-blue transition-colors"
                            placeholder="Enter your password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-lions-gold to-yellow-500 hover:from-lions-gold/90 hover:to-yellow-500/90 text-white font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-slate-900 via-lions-blue to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div className="flex items-center space-x-6 w-full md:w-auto overflow-hidden">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-lions-gold to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 truncate">Admin Portal</h1>
                <p className="text-blue-100 text-sm md:text-lg truncate">Manage your community platform</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="text-center md:text-right hidden md:block">
                <p className="text-sm text-blue-200">Logged in as</p>
                <p className="font-semibold">Administrator</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-white border-white bg-transparent hover:bg-white/10 transition-all duration-200"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Change Password</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <Form {...changePasswordForm}>
                      <form onSubmit={changePasswordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                        <FormField
                          control={changePasswordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={changePasswordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={changePasswordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full bg-lions-blue hover:bg-blue-900" disabled={changePasswordMutation.isPending}>
                          {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="text-lions-blue border-white hover:bg-white hover:text-lions-blue transition-all duration-200 font-semibold px-6"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Posts</p>
                  <p className="text-3xl font-bold">{totalPosts}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Donations</p>
                  <p className="text-3xl font-bold">₹{totalDonationAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending Reviews</p>
                  <p className="text-3xl font-bold">{pendingDonations}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Social Media Posts</p>
                  <p className="text-3xl font-bold">{totalSocialMediaPublications}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="space-y-8">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto md:h-14 bg-white shadow-lg rounded-2xl border-2 border-gray-100 p-1 md:p-1 gap-2">
            <TabsTrigger
              value="posts"
              className="flex items-center justify-center gap-3 text-lg font-semibold text-lions-blue data-[state=active]:bg-lions-blue data-[state=active]:text-white transition-all duration-300 rounded-xl border-2 border-transparent data-[state=active]:border-lions-gold shadow-sm py-3"
            >
              <FileText className="w-5 h-5" />
              Manage Posts
            </TabsTrigger>
            <TabsTrigger
              value="donations"
              className="flex items-center justify-center gap-3 text-lg font-semibold text-lions-blue data-[state=active]:bg-lions-blue data-[state=active]:text-white transition-all duration-300 rounded-xl border-2 border-transparent data-[state=active]:border-lions-gold shadow-sm py-3"
            >
              <DollarSign className="w-5 h-5" />
              View Donations
            </TabsTrigger>
            <TabsTrigger
              value="social-media"
              className="flex items-center justify-center gap-3 text-lg font-semibold text-lions-blue data-[state=active]:bg-lions-blue data-[state=active]:text-white transition-all duration-300 rounded-xl border-2 border-transparent data-[state=active]:border-lions-gold shadow-sm py-3"
            >
              <BarChart3 className="w-5 h-5" />
              Social Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-8">
            <Card className="bg-lions-gold border-2 border-lions-blue shadow-2xl">
              <CardContent className="p-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-4xl font-bold text-lions-blue mb-3">
                      Manage Posts
                    </h2>
                    <p className="text-lions-blue text-lg font-medium">Create and manage community activities and campaigns</p>
                  </div>
                  <Button
                    onClick={handleAddPost}
                    className="bg-lions-blue hover:bg-blue-900 text-white font-extrabold text-lg px-6 py-4 md:px-10 md:py-6 border-2 border-white shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl flex items-center gap-2"
                    size="lg"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="hidden sm:inline">Add New Post</span>
                    <span className="inline sm:hidden">Add</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {postsLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-lions-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl text-gray-600">Loading posts...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.isArray(posts) &&
                  posts?.map((post: Post) => (
                    <Card key={post.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white overflow-hidden">
                      {post.coverImageUrl && (
                        <div className="relative overflow-hidden">
                          <img
                            src={post.coverImageUrl}
                            alt={post.title}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Badge className="bg-lions-gold text-white shadow-lg">
                              <Camera className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lions-blue mb-3 text-xl leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between mb-6">
                          <Badge variant="secondary" className="bg-lions-blue/10 text-lions-blue px-3 py-1">
                            <Calendar className="w-3 h-3 mr-2" />
                            {new Date(post.date).toLocaleDateString()}
                          </Badge>
                          {post.additionalImages && Array.isArray(post.additionalImages) && post.additionalImages.length > 0 && (
                            <Badge variant="outline" className="text-gray-600">
                              +{post.additionalImages.length} photos
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPost(post)}
                            className="flex-1 hover:bg-lions-blue hover:text-white transition-all duration-200 border-2 border-lions-blue/20 hover:border-lions-blue"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePostMutation.mutate(post.id)}
                            className="hover:bg-red-600 transition-colors duration-200 shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="donations" className="space-y-8">
            <Card className="bg-gradient-to-r from-white via-amber-50 to-yellow-50 border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-4xl font-bold text-lions-blue mb-3">
                  Donation Submissions
                </h2>
                <p className="text-gray-600 text-lg">Review and manage donation submissions from community members</p>
              </CardContent>
            </Card>

            {donationsLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-lions-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl text-gray-600">Loading donations...</p>
              </div>
            ) : (
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Donor Info
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Array.isArray(donations) &&
                          donations?.map((donation: Donation) => (
                            <tr key={donation.id} className="hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-semibold text-gray-900">{donation.name}</div>
                                <div className="text-sm text-gray-500">#{donation.id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-900">{donation.email}</div>
                                <div className="text-sm text-gray-500">{donation.mobile}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-lg font-bold text-green-600">
                                  ₹{donation.amount}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge
                                  variant={
                                    donation.status === "approved"
                                      ? "default"
                                      : donation.status === "rejected"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className={`
                                    ${donation.status === "approved" ? "bg-green-100 text-green-800 border-green-200" : ""}
                                    ${donation.status === "rejected" ? "bg-red-100 text-red-800 border-red-200" : ""}
                                    ${donation.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""}
                                    px-3 py-1 text-sm font-semibold
                                  `}
                                >
                                  {donation.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {donation.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                                  {donation.status === "pending" && <AlertCircle className="w-3 h-3 mr-1" />}
                                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                  {donation.proofUrl && (
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => handleViewProof(donation.proofUrl!)}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      View Proof
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateDonationStatusMutation.mutate({
                                        id: donation.id,
                                        status: "approved",
                                      })
                                    }
                                    disabled={donation.status === "approved"}
                                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 disabled:opacity-50"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      updateDonationStatusMutation.mutate({
                                        id: donation.id,
                                        status: "rejected",
                                      })
                                    }
                                    disabled={donation.status === "rejected"}
                                    className="disabled:opacity-50"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="social-media" className="space-y-8">
            <Card className="bg-gradient-to-r from-white via-purple-50 to-indigo-50 border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-4xl font-bold text-lions-blue mb-3">
                      Social Media Publications
                    </h2>
                    <p className="text-gray-600 text-lg">Manage news articles and media coverage of your activities</p>
                  </div>
                  <Button
                    onClick={handleAddSocialMedia}
                    className="bg-lions-blue hover:bg-blue-900 text-white font-extrabold text-lg px-10 py-6 border-2 border-white shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                    size="lg"
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    Add Publication
                  </Button>
                </div>
              </CardContent>
            </Card>

            {socialMediaLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-lions-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl text-gray-600">Loading publications...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.isArray(socialMediaPublications) &&
                  socialMediaPublications?.map((publication: SocialMediaPublication) => (
                    <Card key={publication.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white overflow-hidden">
                      <div className="relative overflow-hidden">
                        <img
                          src={publication.imageUrl}
                          alt={publication.title}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Badge className="bg-lions-gold text-white shadow-lg">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Published
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lions-blue mb-3 text-xl leading-tight">
                          {publication.title}
                        </h3>
                        <div className="flex items-center justify-between mb-6">
                          <Badge variant="secondary" className="bg-lions-blue/10 text-lions-blue px-3 py-1">
                            <Calendar className="w-3 h-3 mr-2" />
                            {new Date(publication.createdAt).toLocaleDateString()}
                          </Badge>
                          <a
                            href={publication.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lions-gold hover:text-lions-blue transition-colors text-sm font-medium"
                          >
                            View Article →
                          </a>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSocialMedia(publication)}
                            className="flex-1 hover:bg-lions-blue hover:text-white transition-all duration-200 border-2 border-lions-blue/20 hover:border-lions-blue"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteSocialMediaMutation.mutate(publication.id)}
                            className="hover:bg-red-600 transition-colors duration-200 shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Post Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b border-gray-100">
            <DialogTitle className="text-3xl font-bold text-lions-blue">
              {editingPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
            <p className="text-gray-600 text-lg">
              {editingPost ? "Update your community post" : "Share a new activity or campaign with your community"}
            </p>
          </DialogHeader>
          <Form {...postForm}>
            <form
              onSubmit={postForm.handleSubmit(handlePostSubmit)}
              className="space-y-6"
            >
              <FormField
                control={postForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-700">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-lions-blue transition-colors"
                        placeholder="Enter a compelling title..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={postForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-700">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        className="text-lg border-2 border-gray-200 focus:border-lions-blue transition-colors resize-none"
                        placeholder="Describe your post in detail..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={postForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-700">Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-lions-blue transition-colors"
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().slice(0, 16)
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-700 block">
                    Cover Image
                  </label>
                  {editingPost?.coverImageUrl && (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2 font-medium">
                        Current cover image:
                      </p>
                      <img
                        src={editingPost.coverImageUrl}
                        alt="Current cover"
                        className="w-full h-32 object-cover rounded-lg border shadow-sm"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    {...(postForm.register as any)("coverImage")}
                    className="h-12 text-lg border-2 border-dashed border-gray-300 hover:border-lions-blue transition-colors cursor-pointer"
                  />
                  <p className="text-sm text-gray-500">
                    {editingPost
                      ? "Upload a new image to replace the current one, or leave empty to keep current image"
                      : "Main image displayed on the campaigns page"}
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-700 block">
                    Additional Images (0-10)
                  </label>
                  {editingPost?.additionalImages &&
                    Array.isArray(editingPost.additionalImages) &&
                    editingPost.additionalImages.length > 0 && (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2 font-medium">
                          Current additional images:
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {editingPost.additionalImages.map((imgUrl, idx) => (
                            <img
                              key={idx}
                              src={imgUrl}
                              alt={`Current additional ${idx + 1}`}
                              className="w-full h-20 object-cover rounded border shadow-sm"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    {...(postForm.register as any)("additionalImages")}
                    className="h-12 text-lg border-2 border-dashed border-gray-300 hover:border-lions-blue transition-colors cursor-pointer"
                  />
                  <p className="text-sm text-gray-500">
                    {editingPost
                      ? "Upload new images to replace all current additional images, or leave empty to keep current images"
                      : "Additional photos shown in the detailed view"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPostDialogOpen(false)}
                  className="flex-1 h-12 text-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 text-lg bg-gradient-to-r from-lions-gold to-yellow-500 hover:from-lions-gold/90 hover:to-yellow-500/90 shadow-lg"
                  disabled={
                    createPostMutation.isPending || updatePostMutation.isPending
                  }
                >
                  {createPostMutation.isPending || updatePostMutation.isPending
                    ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </div>
                    ) : editingPost
                      ? "Update Post"
                      : "Create Post"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Social Media Publication Dialog */}
      <Dialog open={isSocialMediaDialogOpen} onOpenChange={setIsSocialMediaDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-6 border-b border-gray-100">
            <DialogTitle className="text-3xl font-bold text-lions-blue">
              {editingSocialMedia ? "Edit Publication" : "Add New Publication"}
            </DialogTitle>
            <p className="text-gray-600 text-lg">
              {editingSocialMedia ? "Update the social media publication" : "Add a news article or media coverage"}
            </p>
          </DialogHeader>
          <Form {...socialMediaForm}>
            <form
              onSubmit={socialMediaForm.handleSubmit(handleSocialMediaSubmit)}
              className="space-y-6"
            >
              <FormField
                control={socialMediaForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-700">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-lions-blue transition-colors"
                        placeholder="Enter publication title..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={socialMediaForm.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-700">Article URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-lions-blue transition-colors"
                        placeholder="https://example.com/article"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-700 block">
                  Featured Image {!editingSocialMedia && <span className="text-red-500">*</span>}
                </label>
                {editingSocialMedia?.imageUrl && (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Current image:
                    </p>
                    <img
                      src={editingSocialMedia.imageUrl}
                      alt="Current image"
                      className="w-full h-32 object-cover rounded-lg border shadow-sm"
                    />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  {...(socialMediaForm.register as any)("image")}
                  className="h-12 text-lg border-2 border-dashed border-gray-300 hover:border-lions-blue transition-colors cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  {editingSocialMedia
                    ? "Upload a new image to replace the current one, or leave empty to keep current image"
                    : "Upload an image for the publication (required)"}
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSocialMediaDialogOpen(false)}
                  className="flex-1 h-12 text-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 text-lg bg-gradient-to-r from-lions-gold to-yellow-500 hover:from-lions-gold/90 hover:to-yellow-500/90 shadow-lg"
                  disabled={
                    createSocialMediaMutation.isPending || updateSocialMediaMutation.isPending
                  }
                >
                  {createSocialMediaMutation.isPending || updateSocialMediaMutation.isPending
                    ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </div>
                    ) : editingSocialMedia
                      ? "Update Publication"
                      : "Add Publication"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Enhanced Proof Dialog */}
      <Dialog open={isProofDialogOpen} onOpenChange={setIsProofDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-lions-blue">Proof of Payment</DialogTitle>
            <p className="text-gray-600">Review the donation proof submitted by the donor</p>
          </DialogHeader>
          <div className="flex justify-center bg-gray-50 rounded-xl p-6">
            {proofImageUrl && (
              <img
                src={proofImageUrl}
                alt="Proof of payment"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg border-2 border-gray-200"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
