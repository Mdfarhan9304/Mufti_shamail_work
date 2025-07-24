import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const AdminLogin = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);

	const { login, isLoading, isAuthenticated, user } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(email, password, "admin");
			toast.success("Admin login successful!");
			navigate("/admin/dashboard");
		} catch (err: unknown) {
			if (err instanceof AxiosError && err.response) {
				toast.error("Login failed: " + err.response.data.error);
			} else {
				toast.error("Login failed: " + (err as Error).message);
			}
		}
	};

	if (isAuthenticated) {
		if (user?.role === "admin") {
			return <Navigate to="/admin/dashboard" replace />;
		} else {
			return <Navigate to="/dashboard" replace />;
		}
	}

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
									Admin Login
								</h1>
								<p className="text-gray-400">
									Sign in to access admin dashboard
								</p>
							</div>

							<form className="space-y-6" onSubmit={handleSubmit}>
								<div className="space-y-4">
									<div className="relative">
										<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
										<input
											type="email"
											placeholder="Admin email address"
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
											className="w-full bg-[#24271b] text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
										/>
									</div>

									<div className="relative">
										<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
										<input
											type="password"
											placeholder="Password"
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
											className="w-full bg-[#24271b] text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c3e5a5] transition-all"
										/>
									</div>
								</div>

								<div className="flex items-center justify-between text-sm">
									<label className="flex items-center text-gray-400">
										<input
											type="checkbox"
											checked={rememberMe}
											onChange={(e) =>
												setRememberMe(e.target.checked)
											}
											className="mr-2 rounded bg-[#24271b]"
										/>
										Remember me
									</label>
								</div>

								<button
									type="submit"
									className="w-full group flex items-center justify-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-600 rounded-full font-medium text-lg hover:bg-[#a1c780] transition-all"
								>
									Sign In as Admin
									{isLoading ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
									)}
								</button>
							</form>
						</div>
					</motion.div>
				</div>
			</section>
		</main>
	);
};

export default AdminLogin; 