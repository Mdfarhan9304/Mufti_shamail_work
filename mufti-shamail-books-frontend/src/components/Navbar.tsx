import { useState, useEffect } from "react";
import {
	X,
	Menu,
	ShoppingCart,
	LogIn,
	UserPlus,
	User,
	BookOpen,
	LogOut,
	ChevronDown,
	Home,
	Info,
	MessageCircle,
	Lightbulb,
	Package,
	MapPin,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useGuestCart } from "../contexts/GuestCartContext";

const Navbar = () => {
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
	const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);
	const { scrollY, scrollYProgress } = useScroll();

	useEffect(() => {
		return scrollY.on("change", (latest) => {
			const scrollPercentage =
				latest /
				(document.documentElement.scrollHeight - window.innerHeight);
			setHasScrolled(scrollPercentage > 0.05);
		});
	}, [scrollY]);

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (!target.closest('.auth-dropdown') && !target.closest('.cart-dropdown')) {
				setIsAuthDropdownOpen(false);
				setIsCartDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const toggleAuthDropdown = () => {
		setIsAuthDropdownOpen(!isAuthDropdownOpen);
		setIsCartDropdownOpen(false); // Close cart dropdown when opening auth
	};

	const toggleCartDropdown = () => {
		setIsCartDropdownOpen(!isCartDropdownOpen);
		setIsAuthDropdownOpen(false); // Close auth dropdown when opening cart
	};

	const handleAuthMouseEnter = () => {
		setIsAuthDropdownOpen(true);
	};


	const handleCartMouseEnter = () => {
		setIsCartDropdownOpen(true);
	};


	const isActiveRoute = (href: string) => {
		if (href === "/") {
			return location.pathname === "/";
		}
		return location.pathname.startsWith(href);
	};

	const { user, isAuthenticated, logout } = useAuth();
	const { totalItems } = useAuth();
	const { guestTotalItems } = useGuestCart();

	const total = user ? totalItems : guestTotalItems;
	const userRole = user?.role;

	// Navigation items based on user role
	const getUserNavItems = () => {
		if (userRole === "admin") {
			return [
				{ label: "Orders", href: "/admin/dashboard", icon: <User className="w-4 h-4" /> },
				{ label: "Manage Books", href: "/manage-books", icon: <BookOpen className="w-4 h-4" /> },
				{ label: "Manage Fatwahs", href: "/admin/fatwah", icon: <MessageCircle className="w-4 h-4" /> },
			];
		} else {
			return [
				{ label: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
				{ label: "About", href: "/about", icon: <Info className="w-4 h-4" /> },
				{ label: "Initiatives", href: "/initiatives", icon: <Lightbulb className="w-4 h-4" /> },
				{ label: "Fatwahs", href: "/fatwah", icon: <MessageCircle className="w-4 h-4" /> },
			];
		}
	};

	const mainNavItems = getUserNavItems();

	const letterAnimation = {
		initial: { y: 20, opacity: 0 },
		animate: (i: number) => ({
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.8,
				delay: i * 0.1,
				ease: [0.43, 0.13, 0.23, 0.96],
			},
		}),
	};

	return (
		<motion.nav
			className="fixed top-0 left-0 w-full z-[999]"
			initial={{ backgroundColor: "rgba(21, 22, 21, 0)" }}
			animate={{
				backgroundColor: hasScrolled
					? "rgba(21, 22, 21, 0.65)"
					: "rgba(21, 22, 21, 0)",
				backdropFilter: hasScrolled ? "blur(10px)" : "none",
				boxShadow: hasScrolled
					? "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
					: "none",
			}}
			transition={{ duration: 0.4 }}
		>
			<div className="mx-auto px-4 flex justify-between items-center h-20 md:h-24 max-w-[95%] md:max-w-[100%] lg:max-w-[90%] xl:max-w-[75%]">
				{/* Left: Animated Text Logo */}
				<Link to="/" className="flex items-center flex-shrink-0">
					<motion.div
						initial="initial"
						animate="animate"
						className="flex items-center"
					>
						{Array.from("Mufti Shamail").map((letter, i) => (
							<motion.span
								key={i}
								custom={i}
								variants={letterAnimation}
								className={`text-lg md:text-2xl lg:text-3xl font-semibold ${letter === " " ? "mr-1 md:mr-2" : ""
									} ${hasScrolled
										? i < 5
											? "text-white/70"
											: "text-white"
										: "text-white"
									}`}
							>
								{letter}
							</motion.span>
						))}
					</motion.div>
				</Link>

				{/* Center: Main Navigation (Desktop) */}
				<div className="hidden lg:flex items-center space-x-8">
					{mainNavItems.map((item) => (
						<Link
							key={item.label}
							to={item.href}
							className={`
								flex items-center gap-2 px-3 py-2 rounded-lg
								text-base font-medium transition-all duration-300
								border-b-2 border-transparent
								${isActiveRoute(item.href)
									? "text-[#c3e5a5] border-[#c3e5a5]"
									: hasScrolled
										? "text-gray-300 hover:text-white hover:border-white/50"
										: "text-gray-300 hover:text-white hover:border-white/70"
								}
							`}
						>
							{item.icon}
							{item.label}
						</Link>
					))}
				</div>

				{/* Right: Auth & Cart Section */}
				<div className="hidden md:flex items-center space-x-4">
					{/* Cart Dropdown - Only show for regular users, not admins */}
					{userRole !== "admin" && (
						<div className="relative cart-dropdown">
							<button
								onClick={toggleCartDropdown}
								onMouseEnter={handleCartMouseEnter}
								className={`
									flex items-center gap-2 px-4 py-2 rounded-lg
									text-base font-medium transition-all duration-300
									${hasScrolled
										? "text-gray-300 hover:text-white hover:bg-white/10"
										: "text-gray-300 hover:text-white hover:bg-white/10"
									}
								`}
							>
								<ShoppingCart className="w-5 h-5" />
								<span className="hidden lg:block">Cart</span>
								{total > 0 && (
									<span className="absolute -top-1 -right-1 bg-[#c3e5a5] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
										{total}
									</span>
								)}
							</button>

							{/* Cart Dropdown Menu */}
							{isCartDropdownOpen && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="absolute top-full right-0 mt-2 w-48 bg-[#191b14] rounded-xl shadow-xl border border-[#24271b] py-2 z-50"
								>
									<Link
										to="/cart"
										onClick={() => setIsCartDropdownOpen(false)}
										className="block px-4 py-2 text-gray-300 hover:bg-[#24271b] hover:text-white transition-colors"
									>
										View Cart ({total})
									</Link>
									<Link
										to="/checkout"
										onClick={() => setIsCartDropdownOpen(false)}
										className="block px-4 py-2 text-gray-300 hover:bg-[#24271b] hover:text-white transition-colors"
									>
										Checkout
									</Link>
								</motion.div>
							)}
						</div>
					)}

					{/* Auth Dropdown */}
					<div className="relative auth-dropdown">
						<button
							onClick={toggleAuthDropdown}
							onMouseEnter={handleAuthMouseEnter}
							className={`
								flex items-center gap-2 px-4 py-2 rounded-lg
								text-base font-medium transition-all duration-300
								${hasScrolled
									? "text-gray-300 hover:text-white hover:bg-white/10"
									: "text-gray-300 hover:text-white hover:bg-white/10"
								}
							`}
						>
							{isAuthenticated ? (
								<>
									<User className="w-5 h-5" />
									<span className="hidden lg:block">{user?.name || 'User'}</span>
								</>
							) : (
								<>
									<LogIn className="w-5 h-5" />
									<span className="hidden lg:block">Account</span>
								</>
							)}
							<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAuthDropdownOpen ? 'rotate-180' : ''}`} />
						</button>

						{/* Auth Dropdown Menu */}
						{isAuthDropdownOpen && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="absolute top-full right-0 mt-2 w-48 bg-[#191b14] rounded-xl shadow-xl border border-[#24271b] py-2 z-50"
							>
								{!isAuthenticated ? (
									<>
										<Link
											to="/login"
											onClick={() => setIsAuthDropdownOpen(false)}
											className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#24271b] hover:text-white transition-colors"
										>
											<LogIn className="w-4 h-4" />
											Login
										</Link>
										<Link
											to="/register"
											onClick={() => setIsAuthDropdownOpen(false)}
											className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#24271b] hover:text-white transition-colors"
										>
											<UserPlus className="w-4 h-4" />
											Register
										</Link>
									</>
								) : (
									<>
										{userRole === "admin" ? (
											<>
												<Link
													to="/admin/dashboard"
													onClick={() => setIsAuthDropdownOpen(false)}
													className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#24271b] hover:text-white transition-colors"
												>
													<User className="w-4 h-4" />
													Admin Dashboard
												</Link>
											</>
										) : (
											<>
												<Link
													to="/dashboard"
													onClick={() => setIsAuthDropdownOpen(false)}
													className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#24271b] hover:text-white transition-colors"
												>
													<User className="w-4 h-4" />
													Profile
												</Link>
												<Link
													to="/dashboard?tab=orders"
													onClick={() => setIsAuthDropdownOpen(false)}
													className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#24271b] hover:text-white transition-colors"
												>
													<Package className="w-4 h-4" />
													My Orders
												</Link>
												<Link
													to="/dashboard?tab=addresses"
													onClick={() => setIsAuthDropdownOpen(false)}
													className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#24271b] hover:text-white transition-colors"
												>
													<MapPin className="w-4 h-4" />
													Addresses
												</Link>
											</>
										)}
										<hr className="border-[#24271b] my-2" />
										<button
											onClick={() => {
												logout();
												setIsAuthDropdownOpen(false);
											}}
											className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-[#24271b] hover:text-red-400 transition-colors w-full text-left"
										>
											<LogOut className="w-4 h-4" />
											Logout
										</button>
									</>
								)}
							</motion.div>
						)}
					</div>
				</div>

				{/* Mobile Hamburger Icon */}
				<div className="md:hidden flex-shrink-0">
					<button
						onClick={toggleMobileMenu}
						className={`p-2 focus:outline-none transition-colors duration-300 ${hasScrolled ? "text-gray-300" : "text-white"
							}`}
					>
						<Menu size={24} />
					</button>
				</div>

				{/* Mobile Menu Overlay */}
				{isMobileMenuOpen && (
					<div
						className="fixed inset-0 min-h-screen bg-black bg-opacity-50 z-40"
						onClick={toggleMobileMenu}
					/>
				)}

				{/* Mobile Menu */}
				<motion.div
					className={`
						fixed top-0 right-0 min-h-screen w-4/5 shadow-lg z-50
						transform transition-transform duration-300 ease-in-out
						${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
					`}
					animate={{
						backgroundColor: "rgba(25, 27, 20, 0.95)",
						backdropFilter: "blur(10px)",
					}}
				>
					<div className="p-6">
						<button
							onClick={toggleMobileMenu}
							className="absolute top-4 right-4 text-white focus:outline-none"
						>
							<X size={24} />
						</button>

						<div className="flex flex-col space-y-6 mt-12">
							{/* Main Navigation */}
							{getUserNavItems().map((item) => (
								<Link
									key={item.label}
									to={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className={`flex items-center gap-3 text-lg font-medium transition-colors duration-200
										${isActiveRoute(item.href)
											? "text-[#c3e5a5]"
											: "text-gray-300 hover:text-white"
										}
									`}
								>
									{item.icon}
									{item.label}
								</Link>
							))}

							<hr className="border-[#24271b] my-4" />

							{/* Cart - Only show for regular users */}
							{userRole !== "admin" && (
								<Link
									to="/cart"
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors relative"
								>
									<ShoppingCart className="w-5 h-5" />
									Cart
									{total > 0 && (
										<span className="bg-[#c3e5a5] text-black text-xs font-bold px-2 py-1 rounded-full">
											{total}
										</span>
									)}
								</Link>
							)}

							{/* Auth Section */}
							{!isAuthenticated ? (
								<>
									<Link
										to="/login"
										onClick={() => setIsMobileMenuOpen(false)}
										className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
									>
										<LogIn className="w-5 h-5" />
										Login
									</Link>
									<Link
										to="/register"
										onClick={() => setIsMobileMenuOpen(false)}
										className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
									>
										<UserPlus className="w-5 h-5" />
										Register
									</Link>
								</>
							) : (
								<>
									{userRole === "admin" ? (
										<>
											<Link
												to="/admin/dashboard"
												onClick={() => setIsMobileMenuOpen(false)}
												className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
											>
												<User className="w-5 h-5" />
												Admin Dashboard
											</Link>
										</>
									) : (
										<>
											<Link
												to="/dashboard"
												onClick={() => setIsMobileMenuOpen(false)}
												className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
											>
												<User className="w-5 h-5" />
												Profile
											</Link>
											<Link
												to="/dashboard?tab=orders"
												onClick={() => setIsMobileMenuOpen(false)}
												className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
											>
												<Package className="w-5 h-5" />
												My Orders
											</Link>
											<Link
												to="/dashboard?tab=addresses"
												onClick={() => setIsMobileMenuOpen(false)}
												className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-white transition-colors"
											>
												<MapPin className="w-5 h-5" />
												Addresses
											</Link>
										</>
									)}
									<button
										onClick={() => {
											logout();
											setIsMobileMenuOpen(false);
										}}
										className="flex items-center gap-3 text-lg font-medium text-gray-300 hover:text-red-400 transition-colors"
									>
										<LogOut className="w-5 h-5" />
										Logout
									</button>
								</>
							)}
						</div>
					</div>
				</motion.div>
			</div>
			<motion.div
				id="scroll-indicator"
				style={{
					scaleX: scrollYProgress,
					position: "fixed",
					bottom: 0,
					left: 0,
					right: 0,
					height: 1,
					originX: 0,
					backgroundColor: "#c3e5a5",
				}}
			/>
		</motion.nav>
	);
};

export default Navbar;
