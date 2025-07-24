import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../apis/password.api";

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (password.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}

		setIsLoading(true);
		try {
			await resetPassword(token!, password);
			toast.success("Password reset successful!");
			navigate("/login");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to reset password"
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
									Reset Password
								</h1>
								<p className="text-gray-400">
									Enter your new password
								</p>
							</div>

							<form className="space-y-6" onSubmit={handleSubmit}>
								<div className="space-y-4">
									<div className="relative">
										<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
										<input
											type="password"
											placeholder="New password"
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
											className="w-full bg-[#24271b] text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
											required
											minLength={6}
										/>
									</div>

									<div className="relative">
										<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
										<input
											type="password"
											placeholder="Confirm new password"
											value={confirmPassword}
											onChange={(e) =>
												setConfirmPassword(
													e.target.value
												)
											}
											className="w-full bg-[#24271b] text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
											required
											minLength={6}
										/>
									</div>
								</div>

								<button
									type="submit"
									disabled={isLoading}
									className="w-full group flex items-center justify-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-600 rounded-full font-medium text-lg hover:bg-[#a1c780] transition-all disabled:opacity-50"
								>
									Reset Password
									{isLoading ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
									)}
								</button>
							</form>

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

export default ResetPassword;
