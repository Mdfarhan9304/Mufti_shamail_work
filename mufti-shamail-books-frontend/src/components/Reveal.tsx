import { motion } from "framer-motion";

interface RevealProps {
	from?: "left" | "right" | "top" | "bottom" | "inPlace";
	duration?: number;
	children: React.ReactNode;
}

const Reveal: React.FC<RevealProps> = ({
	from = "left",
	duration = 0.5,
	children,
}) => {
	// Initial position based on the "from" prop
	const initialPosition = {
		left: { x: "-20%", y: 0 },
		right: { x: "20%", y: 0 },
		top: { x: 0, y: "-20%" },
		bottom: { x: 0, y: "20%" },
		inPlace: { x: 0, y: 0 },
	};

	return (
		<motion.div
			initial={{
				opacity: 0,
				...(from !== "inPlace" ? initialPosition[from] : {}),
			}}
			whileInView={{
				opacity: 1,
				x: 0,
				y: 0,
			}}
			viewport={{ amount: 0.05 }}
			transition={{
				duration: duration,
				ease: "easeOut",
			}}
		>
			{children}
		</motion.div>
	);
};

export default Reveal;
