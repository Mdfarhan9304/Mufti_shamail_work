import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const ImageModal = ({
	selectedImage,
	onClose,
	images,
	currentIndex,
	setSelectedImage,
}: {
	selectedImage: string;
	onClose: () => void;
	images: Array<{
		image: string;
		title: string;
		category: string;
	}>;
	currentIndex: number;
	setSelectedImage: React.Dispatch<
		React.SetStateAction<{
			url: string;
			index: number;
		} | null>
	>;
}) => {
	const canGoPrevious = currentIndex > 0;
	const canGoNext = currentIndex < images.length - 1;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-[1000] h-full bg-black/90 flex flex-col items-center justify-center p-4"
			onClick={onClose}
		>
			<div className="relative max-w-4xl w-full aspect-[4/3] mb-4 md:mb-8 h-[70vh]">
				<img
					src={selectedImage}
					alt="Certificate Preview"
					className="w-full h-full object-contain"
				/>
			</div>
			<div className="flex gap-8 items-center justify-between md:justify-center w-full bg-[#22271e] md:max-w-max rounded-full p-2">
				<button
					onClick={(e) => {
						e.stopPropagation();
						if (canGoPrevious) {
							setSelectedImage({
								url: images[currentIndex - 1].image,
								index: currentIndex - 1,
							});
						}
					}}
					className={`p-4 rounded-full ${
						canGoPrevious
							? "bg-[#c3e5a5] hover:bg-[#a1c780]"
							: "bg-gray-600 cursor-not-allowed"
					}`}
					disabled={!canGoPrevious}
				>
					<ChevronLeft className="w-6 h-6 text-[#121510]" />
				</button>
				<span className="text-[#696968]">
					{currentIndex + 1}/{images.length}
				</span>
				<button
					onClick={(e) => {
						e.stopPropagation();
						if (canGoNext) {
							setSelectedImage({
								url: images[currentIndex + 1].image,
								index: currentIndex + 1,
							});
						}
					}}
					className={`p-4 rounded-full ${
						canGoNext
							? "bg-[#c3e5a5] hover:bg-[#a1c780]"
							: "bg-gray-600 cursor-not-allowed"
					}`}
					disabled={!canGoNext}
				>
					<ChevronRight className="w-6 h-6 text-[#121510]" />
				</button>
			</div>
		</motion.div>
	);
};

export default ImageModal;
