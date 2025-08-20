import { motion } from "framer-motion";
import { ExternalLink, Calendar, Users, BookOpen, Building2, Globe } from "lucide-react";

// Import images
import markazImage from "../assets/markaz.JPG";
import wahyainImage from "../assets/wahyain.PNG";
import schoolImage from "../assets/school.JPG";
import shehjaarImage from "../assets/shehjaar.JPG";
import riahtiImage from "../assets/riahti.PNG";

const Initiatives = () => {
    const initiatives = [
        {
            id: 1,
            title: "Markaz Al-Wahyain",
            subtitle: "Islamic Learning Platform",
            year: "2021",
            image: markazImage,
            website: "www.markazalwahyain.com",
            description: "Founded by Mufti Shamail Ahmad Abdullah in 2021, Markaz Al-Wahyain is an independent, non-political Islamic learning platform dedicated to spreading authentic Islamic knowledge based on the Qur'an and Sunnah, as understood by the Sahabah and the Salaf-e-Saliheen.",
            highlights: [
                "Over 2000 individuals benefited worldwide",
                "Online and offline programs",
                "Structured courses and workshops",
                "Authentic Islamic knowledge"
            ],
            icon: <BookOpen className="w-8 h-8" />,
            color: "from-blue-500/20 to-cyan-500/20",
            borderColor: "border-blue-500/30"
        },
        {
            id: 2,
            title: "Wahyain Foundation",
            subtitle: "Islamic Charitable Trust",
            year: "2024",
            image: wahyainImage,
            website: "www.wahyainfoundation.com",
            description: "Established in 2024 in Kolkata, India, Wahyain Foundation is a non-profit Islamic charitable trust working to serve the Deeni and educational needs of the community. Under the leadership of Mufti Shamail Ahmad Abdullah, the foundation offers a wide range of services.",
            highlights: [
                "Courses for ages 3 to 70",
                "Dedicated Darul Ifta",
                "Scholarships and career guidance",
                "Community development programs"
            ],
            icon: <Building2 className="w-8 h-8" />,
            color: "from-green-500/20 to-emerald-500/20",
            borderColor: "border-green-500/30"
        },
        {
            id: 3,
            title: "Wahyain International School (WIS)",
            subtitle: "Islamic Education Revolution",
            year: "2025",
            image: schoolImage,
            website: "Coming Soon",
            description: "Wahyain International School, launched in 2025 under Wahyain Foundation by Mufti Shamail Ahmad Abdullah Nadwi, currently runs classes from Nursery to Class 2, with plans to gradually expand up to Class 12. This is not just another school that adds Islamic subjects—WIS is built on a deeper, more purposeful vision.",
            highlights: [
                "Islamic paradigm education",
                "Quran memorization integrated",
                "Alimiyat syllabus alongside academics",
                "Spiritual and academic excellence"
            ],
            icon: <Users className="w-8 h-8" />,
            color: "from-purple-500/20 to-pink-500/20",
            borderColor: "border-purple-500/30"
        },
        {
            id: 4,
            title: "Shehjaar Foods",
            subtitle: "Halal Food Business",
            year: "2021",
            image: shehjaarImage,
            website: "www.shehjaarfoods.com",
            description: "Launched in 2021 by Mufti Shamail Ahmad Abdullah, Shehjaar Foods is a growing food business offering healthy and high-quality food products rooted in natural ingredients and ethical practices. With a focus on purity, taste, and well-being, Shehjaar Foods serves customers across India.",
            highlights: [
                "Natural ingredients",
                "Ethical practices",
                "Direct doorstep delivery",
                "Islamic values-based business"
            ],
            icon: <Globe className="w-8 h-8" />,
            color: "from-orange-500/20 to-red-500/20",
            borderColor: "border-orange-500/30"
        },
        {
            id: 5,
            title: "Rihlati Travels",
            subtitle: "Premium Umrah & Islamic Tours",
            year: "2023",
            image: riahtiImage,
            website: "Coming Soon",
            description: "Launched in 2023 by Mufti Shamail Ahmad Abdullah, Rihlati Travels is a premium Umrah and Islamic tour service focused on offering spiritually enriching and well-guided journeys. It combines high-quality travel arrangements with proper religious mentorship.",
            highlights: [
                "Premium Umrah services",
                "Religious mentorship",
                "Sunnah-aligned journeys",
                "Transformative spiritual experiences"
            ],
            icon: <Calendar className="w-8 h-8" />,
            color: "from-teal-500/20 to-blue-500/20",
            borderColor: "border-teal-500/30"
        }
    ];

    return (
        <main className="min-h-screen bg-[#121510] pt-20 md:pt-24">
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f17] to-[#191a13]" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-[#c3e5a5] mb-6">
                            Initiatives by
                            <span className="block text-4xl md:text-6xl mt-2 bg-gradient-to-r from-[#c3e5a5] to-[#a1c780] bg-clip-text text-transparent">
                                Mufti Shamail
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
                            Transforming lives through authentic Islamic knowledge, education, and community service
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <div className="bg-[#c3e5a5]/10 backdrop-blur-sm rounded-full px-6 py-3 border border-[#c3e5a5]/20">
                                <span className="text-[#c3e5a5] font-semibold">5 Major Initiatives</span>
                            </div>
                            <div className="bg-[#c3e5a5]/10 backdrop-blur-sm rounded-full px-6 py-3 border border-[#c3e5a5]/20">
                                <span className="text-[#c3e5a5] font-semibold">Since 2021</span>
                            </div>
                            <div className="bg-[#c3e5a5]/10 backdrop-blur-sm rounded-full px-6 py-3 border border-[#c3e5a5]/20">
                                <span className="text-[#c3e5a5] font-semibold">Global Impact</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Initiatives Grid */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="space-y-16">
                        {initiatives.map((initiative, index) => (
                            <motion.div
                                key={initiative.id}
                                className={`relative ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex flex-col md:flex gap-8 md:gap-12 items-center`}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                            >
                                {/* Image */}
                                <div className="w-full md:w-1/2 lg:w-2/5">
                                    <div className={`relative rounded-2xl overflow-hidden shadow-2xl border ${initiative.borderColor} bg-gradient-to-br ${initiative.color}`}>
                                        <div className="aspect-[4/3] relative">
                                            <img
                                                src={initiative.image}
                                                alt={initiative.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        </div>

                                        {/* Year Badge */}
                                        <div className="absolute top-4 right-4 bg-[#c3e5a5] text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                                            Est. {initiative.year}
                                        </div>

                                        {/* Icon */}
                                        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 text-white">
                                            {initiative.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="w-full md:w-1/2 lg:w-3/5 space-y-6">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#c3e5a5] mb-2">
                                            {initiative.title}
                                        </h2>
                                        <p className="text-lg md:text-xl text-[#c3e5a5]/70 font-medium">
                                            {initiative.subtitle}
                                        </p>
                                    </div>

                                    <p className="text-gray-300 text-lg leading-relaxed">
                                        {initiative.description}
                                    </p>

                                    {/* Highlights */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {initiative.highlights.map((highlight, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 bg-[#191b14] rounded-lg p-3 border border-[#24271b]"
                                            >
                                                <div className="w-2 h-2 bg-[#c3e5a5] rounded-full flex-shrink-0" />
                                                <span className="text-gray-300 text-sm font-medium">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Website Link */}
                                    {initiative.website !== "Coming Soon" && (
                                        <div className="pt-4">
                                            <a
                                                href={`https://${initiative.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-[#c3e5a5] text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-[#a1c780] transition-all group"
                                            >
                                                Visit Website
                                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    )}

                                    {initiative.website === "Coming Soon" && (
                                        <div className="pt-4">
                                            <span className="inline-flex items-center gap-2 bg-gray-600/20 text-gray-400 px-6 py-3 rounded-full font-semibold cursor-not-allowed">
                                                Website Coming Soon
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        className="bg-gradient-to-br from-[#c3e5a5]/10 to-[#a1c780]/10 rounded-2xl p-8 md:p-12 border border-[#c3e5a5]/20 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[#c3e5a5] mb-4">
                            Join the Movement
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Be part of these transformative initiatives that are making a real difference in the Muslim community worldwide. Together, we can build a better future rooted in authentic Islamic values.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-[#c3e5a5] text-gray-800 px-8 py-4 rounded-full font-semibold hover:bg-[#a1c780] transition-all">
                                Learn More
                            </button>
                            <button className="bg-transparent border-2 border-[#c3e5a5] text-[#c3e5a5] px-8 py-4 rounded-full font-semibold hover:bg-[#c3e5a5] hover:text-gray-800 transition-all">
                                Get Involved
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default Initiatives;
