import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Heart, Users, Star } from "lucide-react";
import Mufti from '../assets/mufti_shamail.jpg';

const About = () => {
	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			{/* Hero Section */}
			<section className="relative py-16 md:py-24 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-[#0a1508] via-[#1a2f14] to-[#0f1a0a]" />

				{/* Decorative Background Elements */}
				<div className="absolute inset-0 opacity-10">
					{Array.from({ length: 6 }).map((_, i) => (
						<motion.div
							key={i}
							className="absolute"
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
							}}
							animate={{
								rotate: [0, 360],
								scale: [0.5, 1, 0.5],
								opacity: [0.1, 0.3, 0.1],
							}}
							transition={{
								duration: 8 + Math.random() * 4,
								repeat: Number.POSITIVE_INFINITY,
								delay: Math.random() * 2,
								ease: "easeInOut",
							}}
						>
							<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
								<path
									d="M20,5 L22,15 L32,17 L22,22 L25,32 L20,27 L15,32 L18,22 L8,17 L18,15 Z"
									fill="#c3e5a5"
									opacity="0.6"
								/>
							</svg>
						</motion.div>
					))}
				</div>

				<div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
					<div className="text-center mb-16">
						<motion.div
							className="inline-flex items-center gap-2 px-4 py-2 bg-[#c3e5a5]/10 rounded-full text-[#c3e5a5] mb-6"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<BookOpen className="w-4 h-4" />
							<span className="text-sm font-medium">About Our Scholar</span>
						</motion.div>

						<motion.h1
							className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							<span className="text-[#c3e5a5]">Mufti Shamail</span> Nadwi
						</motion.h1>

						<motion.p
							className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
						>
							A distinguished Islamic scholar dedicated to bridging classical knowledge with contemporary understanding
						</motion.p>
					</div>
				</div>
			</section>

			{/* Main Content Section */}
			<section className="relative py-16">
				<div className="max-w-7xl mx-auto px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
						{/* Left Image Column */}
						<motion.div
							className="relative"
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
						>
							<div className="relative rounded-3xl overflow-hidden shadow-2xl">
								<img
									src={Mufti}
									alt="Mufti Shamail Nadwi"
									className="w-full h-[600px] object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

								{/* Quote Overlay */}
								{/* <div className="absolute bottom-8 left-8 right-8">
									<blockquote className="text-white text-lg font-medium">
										"Knowledge is light, and it illuminates the path to righteousness and peace."
									</blockquote>
									<cite className="text-[#c3e5a5] text-sm mt-2 block">- Mufti Shamail Nadwi</cite>
								</div> */}
							</div>

							{/* Decorative Elements */}
							<div className="absolute -top-8 -left-8 w-32 h-32 bg-[#c3e5a5]/20 rounded-full blur-2xl" />
							<div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#c3e5a5]/10 rounded-full blur-3xl" />
						</motion.div>

						{/* Right Content Column */}
						<motion.div
							className="space-y-8"
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							viewport={{ once: true }}
						>
							<div>
								<h2 className="text-3xl md:text-4xl font-bold text-[#c3e5a5] mb-6">
									Scholar & Educator
								</h2>
								<div className="space-y-6 text-gray-300 text-lg leading-relaxed">
									<p>
										<span className="text-[#c3e5a5] font-semibold">
											Mufti Shamail Ahmad Abdullah Nadwi
										</span>{" "}
										is a distinguished graduate of Darul Uloom
										Nadwatul Ulama, a renowned Islamic university,
										where he specialized in Islamic studies. After
										graduation, he pursued post-graduate studies in
										Tafseer and Uloomul Quran, further deepening his
										understanding of Quranic exegesis and the
										sciences of the Quran. His commitment to Islamic
										scholarship led him to specialize in Tadreeb
										Alal Ifta (Mufti) at the same institution.
									</p>
									<p>
										He is the{" "}
										<span className="text-[#c3e5a5] font-semibold">
											founder of Markaz Al-Wahyain
										</span>
										, an online Islamic institution established in
										2021, offering quality education to students
										globally. He also founded Wahyain Foundation, a
										charitable Islamic trust established in 2024,
										providing educational and welfare services.
									</p>
									<p>
										Beyond his institution, Mufti Shamail Nadwi has
										made a significant impact in the digital realm,
										emerging as a{" "}
										<span className="text-[#c3e5a5] font-semibold">
											prominent scholar on social media
										</span>
										. His efforts focus on countering Western
										ideologies and presenting Islam as the true way
										of life. He strives to foster unity within the
										Ummah and works to bring cohesion among Muslims
										worldwide.
									</p>
									<p>
										Additionally, Mufti Shamail serves as the{" "}
										<span className="text-[#c3e5a5] font-semibold">
											Khateeb and Mufassir-e-Quran
										</span>{" "}
										at Kobi Bagan Masjid, Kolkata, where he combines
										his academic expertise with spiritual leadership
										to benefit the Ummah.
									</p>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Educational Certifications Section */}
			<section className="relative py-16 bg-[#1a1f17]/50">
				<div className="max-w-7xl mx-auto px-6 lg:px-8">
					<motion.div
						className="text-center mb-16"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#c3e5a5] mb-4">
							Educational Certifications
						</h2>
						<p className="text-gray-400 text-lg max-w-3xl mx-auto">
							Authentic Islamic education from renowned institutions, showcasing a comprehensive foundation in Islamic sciences
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
						<motion.div
							className="bg-[#121510] p-6 rounded-2xl border border-[#c3e5a5]/20 hover:border-[#c3e5a5]/40 transition-all"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							viewport={{ once: true }}
							whileHover={{ scale: 1.02 }}
						>
							<div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
								<img
									src="https://res.cloudinary.com/dwoke3tu3/image/upload/v1755628539/tadreebalalifta_koipbz.jpg"
									alt="Tadreeb Al Ifta Certification"
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
								/>
							</div>
							<h3 className="text-lg font-semibold text-white text-center mb-2">
								Tadreeb Al Ifta
							</h3>
							<p className="text-gray-400 text-sm text-center">
								Advanced Fatwa Training Certificate
							</p>
						</motion.div>

						<motion.div
							className="bg-[#121510] p-6 rounded-2xl border border-[#c3e5a5]/20 hover:border-[#c3e5a5]/40 transition-all"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							whileHover={{ scale: 1.02 }}
						>
							<div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
								<img
									src="https://res.cloudinary.com/dwoke3tu3/image/upload/v1755628537/tafseer_i7ino6.jpg"
									alt="Tafseer Certification"
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
								/>
							</div>
							<h3 className="text-lg font-semibold text-white text-center mb-2">
								Tafseer Studies
							</h3>
							<p className="text-gray-400 text-sm text-center">
								Quranic Interpretation Certificate
							</p>
						</motion.div>

						<motion.div
							className="bg-[#121510] p-6 rounded-2xl border border-[#c3e5a5]/20 hover:border-[#c3e5a5]/40 transition-all"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							viewport={{ once: true }}
							whileHover={{ scale: 1.02 }}
						>
							<div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
								<img
									src="https://res.cloudinary.com/dwoke3tu3/image/upload/v1755628537/aalimiyat_v3amgh.jpg"
									alt="Aalimiyat Certification"
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
								/>
							</div>
							<h3 className="text-lg font-semibold text-white text-center mb-2">
								Aalimiyat
							</h3>
							<p className="text-gray-400 text-sm text-center">
								Islamic Scholar Graduation
							</p>
						</motion.div>

						<motion.div
							className="bg-[#121510] p-6 rounded-2xl border border-[#c3e5a5]/20 hover:border-[#c3e5a5]/40 transition-all"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
							whileHover={{ scale: 1.02 }}
						>
							<div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
								<img
									src="https://res.cloudinary.com/dwoke3tu3/image/upload/v1755628537/arabicSpeech_ep0ac4.jpg"
									alt="Arabic Speech Certification"
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
								/>
							</div>
							<h3 className="text-lg font-semibold text-white text-center mb-2">
								Arabic Speech
							</h3>
							<p className="text-gray-400 text-sm text-center">
								Arabic Oratory Certificate
							</p>
						</motion.div>

						<motion.div
							className="bg-[#121510] p-6 rounded-2xl border border-[#c3e5a5]/20 hover:border-[#c3e5a5]/40 transition-all"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.5 }}
							viewport={{ once: true }}
							whileHover={{ scale: 1.02 }}
						>
							<div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
								<img
									src="https://res.cloudinary.com/dwoke3tu3/image/upload/v1755628537/fazeelat_hhzzrp.jpg"
									alt="Fazeelat Certification"
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
								/>
							</div>
							<h3 className="text-lg font-semibold text-white text-center mb-2">
								Fazeelat
							</h3>
							<p className="text-gray-400 text-sm text-center">
								Advanced Islamic Studies
							</p>
						</motion.div>
					</div>

					{/* View All Certifications Button */}
					<motion.div
						className="text-center mt-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						viewport={{ once: true }}
					>
						<Link
							to="/certifications"
							className="inline-flex items-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full hover:bg-[#a1c780] transition-all font-medium text-lg group"
						>
							<BookOpen className="w-5 h-5" />
							View All Certifications & Ijazahs
							<ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="relative py-16">
				<div className="max-w-7xl mx-auto px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
						>
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#c3e5a5] mb-6">
								Our Mission
							</h2>
							<div className="space-y-6 text-gray-300 text-lg leading-relaxed">
								<p>
									To make authentic Islamic knowledge accessible to all seekers, regardless of their background or level of understanding. We believe that every individual deserves access to clear, reliable guidance based on the Quran and Sunnah.
								</p>
								<p>
									Through comprehensive books, thoughtful answers, and educational content, we strive to bridge the gap between classical Islamic scholarship and contemporary needs, fostering spiritual growth and practical understanding.
								</p>
								<p>
									Our goal is to build a community of learners who can apply Islamic principles in their daily lives, contributing to a more just, compassionate, and enlightened society.
								</p>
							</div>
						</motion.div>

						<motion.div
							className="relative"
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							viewport={{ once: true }}
						>
							<div className="bg-gradient-to-br from-[#c3e5a5]/10 to-[#c3e5a5]/5 p-8 rounded-3xl border border-[#c3e5a5]/20">
								<div className="grid grid-cols-2 gap-6">
									<div className="text-center">
										<Heart className="w-12 h-12 text-[#c3e5a5] mx-auto mb-3" />
										<h3 className="text-white font-semibold mb-2">Compassion</h3>
										<p className="text-gray-400 text-sm">Spreading love and understanding</p>
									</div>
									<div className="text-center">
										<Star className="w-12 h-12 text-[#c3e5a5] mx-auto mb-3" />
										<h3 className="text-white font-semibold mb-2">Excellence</h3>
										<p className="text-gray-400 text-sm">Committed to highest standards</p>
									</div>
									<div className="text-center">
										<BookOpen className="w-12 h-12 text-[#c3e5a5] mx-auto mb-3" />
										<h3 className="text-white font-semibold mb-2">Knowledge</h3>
										<p className="text-gray-400 text-sm">Authentic Islamic wisdom</p>
									</div>
									<div className="text-center">
										<Users className="w-12 h-12 text-[#c3e5a5] mx-auto mb-3" />
										<h3 className="text-white font-semibold mb-2">Community</h3>
										<p className="text-gray-400 text-sm">Building bonds of faith</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Call to Action */}
			<section className="relative py-16 bg-[#1a1f17]/50">
				<div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
							Ready to Begin Your Journey?
						</h2>
						<p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
							Explore our collection of books or ask your questions to start your path of Islamic learning and spiritual growth.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								to="/"
								className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-semibold hover:bg-[#a1c780] transition-all transform hover:scale-105"
							>
								<ArrowLeft className="w-5 h-5" />
								Back to Books
							</Link>
							<Link
								to="/fatwah"
								className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#c3e5a5] text-[#c3e5a5] rounded-full font-semibold hover:bg-[#c3e5a5] hover:text-gray-800 transition-all"
							>
								Ask a Question
							</Link>
						</div>
					</motion.div>
				</div>
			</section>
		</main>
	);
};

export default About;
