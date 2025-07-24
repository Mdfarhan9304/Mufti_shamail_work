import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../apis/password.api";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isEmailSent, setIsEmailSent] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await forgotPassword(email);
			setIsEmailSent(true);
			toast.success("Password reset email sent!");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to send reset email"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
			<section className="relative h-[90vh] grid place-items-center">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />

				<div className="mx-auto min-w-[35vw]">
					<motion.div
						className="bg-[#191b14] rounded-2xl p-4 md:p-8 shadow-xl relative z-10"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<div className="space-y-8">
							<div className="text-center">
								<h1 className="text-3xl md:text-4xl font-bold text-[#c3e5a5] mb-4">
									Forgot Password
								</h1>
								<p className="text-gray-400">
									{isEmailSent
										? "Check your email for reset instructions"
										: "Enter your email to reset your password"}
								</p>
							</div>

							{!isEmailSent ? (
								<form
									className="space-y-6"
									onSubmit={handleSubmit}
								>
									<div className="space-y-4">
										<div className="relative">
											<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
											<input
												type="email"
												placeholder="Email address"
												value={email}
												onChange={(e) =>
													setEmail(e.target.value)
												}
												className="w-full bg-[#24271b] text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
												required
											/>
										</div>
									</div>

									<button
										type="submit"
										disabled={isLoading}
										className="w-full group flex items-center justify-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-600 rounded-full font-medium text-lg hover:bg-[#a1c780] transition-all disabled:opacity-50"
									>
										Send Reset Link
										{isLoading ? (
											<Loader2 className="w-5 h-5 animate-spin" />
										) : (
											<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
										)}
									</button>
								</form>
							) : (
								<div className="text-center space-y-6">
									<p className="text-gray-400">
										We've sent a password reset link to{" "}
										<span className="text-[#c3e5a5]">
											{email}
										</span>
									</p>
									<p className="text-gray-400">
										Didn't receive the email?{" "}
										<button
											onClick={() =>
												setIsEmailSent(false)
											}
											className="text-[#c3e5a5] hover:text-[#a1c780]"
										>
											Try again
										</button>
									</p>
								</div>
							)}

							<div className="text-center">
								<Link
									to="/login"
									className="text-[#c3e5a5] hover:text-[#a1c780] font-medium"
								>
									Back to Login
								</Link>
							</div>
						</div>
					</motion.div>
				</div>
			</section>
		</main>
	);
};

export default ForgotPassword;
