import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageCarouselProps {
	images: string[];
	bookName: string;
}

const ImageCarousel = ({ images, bookName }: ImageCarouselProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	console.log(images);

	const next = () => setCurrentIndex((i) => (i + 1) % images.length);
	const prev = () =>
		setCurrentIndex((i) => (i - 1 + images.length) % images.length);

	return (
		<div className="relative aspect-square w-full max-w-2xl mx-auto">
			<AnimatePresence mode="wait">
				<motion.img
					key={currentIndex}
					src={`${import.meta.env.VITE_API_URL}/${
						images[currentIndex]
					}`}
					alt={`${bookName} - Image ${currentIndex + 1}`}
					className="w-full h-full object-contain rounded-2xl"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
				/>
			</AnimatePresence>

			{images.length > 1 && (
				<>
					<button
						onClick={prev}
						className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
					>
						<ChevronLeft className="w-6 h-6" />
					</button>
					<button
						onClick={next}
						className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
					>
						<ChevronRight className="w-6 h-6" />
					</button>

					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
						{images.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={`w-2 h-2 rounded-full transition-colors ${
									index === currentIndex
										? "bg-[#c3e5a5]"
										: "bg-white/50"
								}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default ImageCarousel;
