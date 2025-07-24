import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		const scrollPercentage =
			(window.scrollY /
				(document.documentElement.scrollHeight - window.innerHeight)) *
			100;

		setIsVisible(scrollPercentage > 25);
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	return (
		<>
			{isVisible && (
				<button
					onClick={scrollToTop}
					className="fixed bottom-6 right-6 z-50 bg-[#6074ad] text-white rounded-full p-3 shadow-lg border border-white/20"
					aria-label="Scroll to top"
				>
					<ChevronUp size={24} />
				</button>
			)}
		</>
	);
};

export default ScrollToTopButton;
