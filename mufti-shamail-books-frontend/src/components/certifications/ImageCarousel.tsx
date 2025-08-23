import { Maximize2 } from "lucide-react";
import { motion } from "framer-motion";

const ImageCarousel = ({
	images,
	setSelectedCategory,
	setSelectedImage,
}: {
	images: Array<{
		image: string;
		title: string;
		category: string;
	}>;
	setSelectedCategory: () => void;
	setSelectedImage: React.Dispatch<
		React.SetStateAction<{
			url: string;
			index: number;
		} | null>
	>;
}) => {
	return (
		<div className="relative">
			<div className="overflow-x-auto scrollbar-hide">
				<div className="flex gap-6 px-4 pb-4">
					{images.map(
						(
							cert: {
								image: string;
								title: string;
								category: string;
							},
							index: number
						) => (
							<motion.div
								key={index}
								className="relative h-[500px] min-w-[300px] md:min-w-[400px]"
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
							>
								<div className="group relative w-full h-full rounded-lg overflow-hidden">
									<img
										src={cert.image}
										alt={cert.title}
										className="w-full h-full object-contain bg-[#191b14]"
									/>
									{/* Desktop View */}
									<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
										<button
											onClick={() => {
												setSelectedCategory();
												setSelectedImage({
													url: cert.image,
													index,
												});
											}}
											className="p-2 bg-[#c3e5a5] rounded-full"
										>
											<Maximize2 className="w-6 h-6 text-[#121510]" />
										</button>
									</div>
									{/* Mobile View */}
									<div className="absolute bottom-0 right-0 p-4 md:hidden">
										<button
											onClick={() => {
												setSelectedCategory();
												setSelectedImage({
													url: cert.image,
													index,
												});
											}}
											className="px-2 py-2 bg-gradient-to-r from-[#c3e5a5] to-[#a1c780] rounded-full text-[#121510] font-medium"
										>
											<Maximize2 className="w-6 h-6 text-[#121510]" />
										</button>
									</div>
								</div>
							</motion.div>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default ImageCarousel;
