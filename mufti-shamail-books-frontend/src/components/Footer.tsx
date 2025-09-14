import { Facebook, Instagram, Twitter, Youtube, Mail, AtSign } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="bg-[#121510] text-white relative">
			{/* Background Gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-[#24271b] to-[#121510]" />

			<div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
				{/* Main Footer Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
					{/* Brand Section */}
					<motion.div
						className="space-y-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						<h2 className="text-2xl font-bold text-[#c3e5a5]">
							Mufti Shamail Nadwi
						</h2>
						<p className="text-gray-400 text-sm">
							Founder of Markaz Al-Wahyain and Wahyain Foundation,
							dedicated to spreading Islamic knowledge and wisdom.
						</p>
					</motion.div>

					{/* Quick Links */}
					<motion.div
						className="space-y-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
					>
						<h3 className="text-xl font-semibold text-[#c3e5a5]">
							Quick Links
						</h3>
						<ul className="space-y-2">
							{["About", "Books", "Fatwah", "Contact"].map(
								(item) => (
									<li key={item}>
										<Link
											to={`/${item.toLowerCase()}`}
											className="text-gray-400 hover:text-[#c3e5a5] transition-colors"
										>
											{item}
										</Link>
									</li>
								)
							)}
						</ul>
					</motion.div>

					{/* Contact */}
					<motion.div
						className="space-y-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
					>
						<h3 className="text-xl font-semibold text-[#c3e5a5]">
							Contact
						</h3>
						<p className="text-gray-400">
						289E Dargah Road, Park Circus, Kolkata-700017
						</p>
						<Link
							to="mailto:contact@muftishamail.com"
							className="flex items-center gap-2 text-gray-400 hover:text-[#c3e5a5] transition-colors"
						>
							<Mail size={16} />
							contact@muftishamail.com
						</Link>
					</motion.div>

					{/* Social Links */}
					<motion.div
						className="space-y-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
					>
						<h3 className="text-xl font-semibold text-[#c3e5a5]">
							Follow Us
						</h3>
						<div className="flex gap-4">
							{[
								{ 
									icon: Instagram, 
									link: "https://www.instagram.com/muftishamail",
									label: "Instagram" 
								},
								{ 
									icon: Youtube, 
									link: "https://www.youtube.com/@muftishamail",
									label: "YouTube" 
								},
								{ 
									icon: Facebook, 
									link: "https://www.facebook.com/muftishamail",
									label: "Facebook" 
								},
								{ 
									icon: Twitter, 
									link: "https://x.com/muftishamail",
									label: "X (Twitter)" 
								},
								{ 
									icon: AtSign, 
									link: "https://www.threads.net/@muftishamail",
									label: "Threads" 
								},
							].map(({ icon: Icon, link, label }, index) => (
								<motion.a
									key={index}
									href={link}
									target="_blank"
									rel="noopener noreferrer"
									className="p-2 bg-[#191b14] rounded-lg hover:bg-[#c3e5a5] text-gray-400 hover:text-[#121510] transition-all"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									title={label}
								>
									<Icon size={20} />
								</motion.a>
							))}
						</div>
					</motion.div>
				</div>

				{/* Copyright */}
				<motion.div
					className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4 }}
				>
					<p>
						&copy; {new Date().getFullYear()} Mufti Shamail Nadwi.
						All rights reserved.
					</p>
					<Link
						to="/privacy-policy"
						className="text-gray-400 hover:text-[#c3e5a5] transition-colors"
					>
						Privacy Policy
					</Link>
					<span className="mx-2">|</span>
					<Link
						to="/terms-and-conditions"
						className="text-gray-400 hover:text-[#c3e5a5] transition-colors"
					>
						Terms of Service
					</Link>
				</motion.div>
			</div>
		</footer>
	);
};

export default Footer;
