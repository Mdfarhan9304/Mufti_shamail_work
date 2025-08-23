import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { certificateImages, ijazahImages } from "../helper";
import ImageCarousel from "../components/certifications/ImageCarousel";
import ImageModal from "../components/certifications/ImageModal";
import { ArrowRight } from "lucide-react";

const Certifications = () => {
	const [selectedImage, setSelectedImage] = useState<{
		url: string;
		index: number;
	} | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<
		"certificates" | "ijazahs" | ""
	>("");

	useEffect(() => {
		if (selectedImage) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		// Cleanup to reset the overflow when the component unmounts
		return () => {
			document.body.style.overflow = "";
		};
	}, [selectedImage]);

	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			{/* Hero Section */}
			<motion.div className="relative h-[40vh] flex items-center justify-center">
				<div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />
				<h1 className="relative text-4xl md:text-7xl font-bold text-[#c3e5a5] text-center px-6">
					Certifications & Ijazahs
				</h1>
			</motion.div>

			{/* Certificates Section */}
			<section className="py-24 px-6">
				<motion.h2
					className="text-3xl md:text-5xl font-bold text-[#c3e5a5] text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
				>
					Academic Certificates
				</motion.h2>
				<ImageCarousel
					images={certificateImages}
					setSelectedCategory={() =>
						setSelectedCategory("certificates")
					}
					setSelectedImage={setSelectedImage}
				/>
				<motion.div
					className="flex items-center justify-center mt-5 md:hidden text-[#c3e5a5]"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						repeat: Infinity,
						repeatType: "reverse",
						duration: 1.5,
					}}
				>
					Scroll <ArrowRight size={24} className="ml-2" />
				</motion.div>
			</section>

			{/* Ijazahs Section */}
			<section className="py-24 px-6 bg-[#191b14]">
				<motion.h2
					className="text-3xl md:text-5xl font-bold text-[#c3e5a5] text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
				>
					Islamic Ijazahs
				</motion.h2>
				<ImageCarousel
					images={ijazahImages}
					setSelectedCategory={() => setSelectedCategory("ijazahs")}
					setSelectedImage={setSelectedImage}
				/>
				<motion.div
					className="flex items-center justify-center mt-5 md:hidden text-[#c3e5a5]"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						repeat: Infinity,
						repeatType: "reverse",
						duration: 1.5,
					}}
				>
					Scroll <ArrowRight size={24} className="ml-2" />
				</motion.div>
			</section>

			{/* Image Preview Modal */}
			{selectedImage && (
				<ImageModal
					selectedImage={selectedImage.url}
					onClose={() => setSelectedImage(null)}
					images={
						selectedCategory === "certificates"
							? certificateImages
							: ijazahImages
					}
					currentIndex={selectedImage.index}
					setSelectedImage={setSelectedImage}
				/>
			)}
		</main>
	);
};

export default Certifications;
