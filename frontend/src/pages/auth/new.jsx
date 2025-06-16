// import { useState } from "react";
// import { Link } from "wouter";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
// import { Input } from "../../components/ui/input";
// import { Loader2 } from "lucide-react";
// import { useToast } from "../../hooks/use-toast";

// // Define the form schema
// const forgotPasswordSchema = z.object({
//   email: z.string().email({ message: "Please enter a valid email address" }),
// });

// export default function ForgotPassword() {
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   // Initialize form with default values
//   const form = useForm({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   // Handle form submission
//   const onSubmit = async (values) => {
//     setIsLoading(true);

//     try {
//       // Call backend API
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/forgot-password`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: values.email }),
//         }
//       );
//       const data = await response.json();

//       setIsSubmitted(true);

//       toast({
//         title: "Reset link sent",
//         description: data.message || "If an account exists with that email, you will receive a password reset link shortly.",
//       });
//     } catch (error) {
//       console.error("Password reset error:", error);

//       toast({
//         title: "Something went wrong",
//         description: "We couldn't process your request. Please try again later.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
//       <div className="flex flex-col justify-center space-y-6 w-full max-w-md">
//         <div className="flex flex-col space-y-2 text-center">
//           <h1 className="text-2xl font-semibold tracking-tight">Reset Your Password</h1>
//           <p className="text-sm text-muted-foreground">
//             Enter your email address and we'll send you a link to reset your password
//           </p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Forgot Password</CardTitle>
//             <CardDescription>
//               {isSubmitted 
//                 ? "Check your email for the reset link" 
//                 : "Enter the email address associated with your account"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isSubmitted ? (
//               <div className="text-center py-6">
//                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mx-auto flex items-center justify-center mb-4">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-medium mb-2">Email Sent</h3>
//                 <p className="text-sm text-muted-foreground mb-4">
//                   We've sent a password reset link to your email address. The link will expire in 1 hour.
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   Didn't receive the email? Check your spam folder or{" "}
//                   <button 
//                     className="text-primary hover:underline font-medium"
//                     onClick={() => setIsSubmitted(false)}
//                   >
//                     try again
//                   </button>
//                 </p>
//               </div>
//             ) : (
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                   <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email</FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="Enter your email address"
//                             type="email"
//                             autoComplete="email"
//                             {...field}
//                             disabled={isLoading}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <Button 
//                     type="submit" 
//                     disabled={isLoading} 
//                     className="w-full"
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Sending...
//                       </>
//                     ) : (
//                       "Send Reset Link"
//                     )}
//                   </Button>
//                 </form>
//               </Form>
//             )}
//           </CardContent>
//           <CardFooter className="flex justify-center">
//             <div className="text-center text-sm">
//               Remember your password?{" "}
//               <Link href="/auth/login" className="text-primary hover:underline font-medium">
//                 Back to login
//               </Link>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }
