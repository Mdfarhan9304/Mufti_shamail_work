import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Play, Pause } from "lucide-react";
import BookCard from "../components/books/BookCard";
import ArticleCard from "../components/articles/ArticleCard";
import { useEffect, useState, useRef } from "react";
import { Book, getAllBooks } from "../apis/books.api";
import { Article, getRecentArticles } from "../apis/articles.api";
import { toast } from "react-toastify";
import Mufti from "../assets/mufti_shamail.jpg";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch books
        const booksResponse = await getAllBooks();
        setBooks(booksResponse.data || []);

        // Fetch recent articles
        const articlesResponse = await getRecentArticles(3);
        setArticles(articlesResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
        // Set empty arrays as fallback
        setBooks([]);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#121510] pt-24 grid place-items-center">
        <Loader2 className="w-8 h-8 text-[#c3e5a5] animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#121510] pt-24">
      {/* Enhanced Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1508] via-[#1a2f14] to-[#0f1a0a]" />

        <div className="absolute inset-0 opacity-15">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 bg-gradient-to-t from-transparent via-[#c3e5a5] to-transparent"
              style={{
                height: "100%",
                left: `${20 + i * 20}%`,
                transformOrigin: "bottom center",
              }}
              animate={{
                rotate: [0, 1, -1, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 6 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 0.8, 0],
                rotate: [0, 180, 360],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path
                  d="M4,0 L4.5,2.5 L8,4 L4.5,5.5 L4,8 L3.5,5.5 L0,4 L3.5,2.5 Z"
                  fill="#c3e5a5"
                  className="drop-shadow-sm"
                />
              </svg>
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-[#c3e5a5] rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-15, -30, -15],
                x: [-5, 5, -5],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: 8 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 opacity-8">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="islamicPattern"
                x="0"
                y="0"
                width="200"
                height="200"
                patternUnits="userSpaceOnUse"
              >
                <g transform="translate(100,100)">
                  <path
                    d="M0,-30 L9,-9 L30,0 L9,9 L0,30 L-9,9 L-30,0 L-9,-9 Z"
                    fill="none"
                    stroke="#c3e5a5"
                    strokeWidth="0.5"
                  />
                  <circle cx="0" cy="0" r="4" fill="#c3e5a5" opacity="0.6" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamicPattern)" />
          </svg>
        </div>

        <motion.div
          className="absolute top-20 right-20 opacity-25"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: {
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            scale: {
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path
              d="M20,12 Q12,20 12,30 Q12,40 20,48 Q26,42 26,30 Q26,18 20,12"
              fill="#c3e5a5"
              opacity="0.7"
            />
            <path
              d="M32,20 L35,26 L42,26 L37,30 L39,37 L32,33 L25,37 L27,30 L22,26 L29,26 Z"
              fill="#c3e5a5"
              opacity="0.8"
            />
          </svg>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(195, 229, 165, 0.2)",
                    "0 0 15px rgba(195, 229, 165, 0.3)",
                    "0 0 10px rgba(195, 229, 165, 0.2)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                Welcome to{" "}
                <span className="text-[#c3e5a5] drop-shadow-lg">
                  Mufti Shamail
                </span>{" "}
                Official Website
              </motion.h1>
              <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                This platform is dedicated to spreading authentic Islamic
                knowledge with clarity and compassion. Here, you can explore his
                scholarly books, engage with insightful lectures, and seek
                guidance through our Fatwa service. Delve into a trusted
                resource designed to connect timeless wisdom with
                contemporary life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="#books"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-semibold hover:bg-[#a1c780] transition-all transform hover:scale-105 shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(195, 229, 165, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Books
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(195, 229, 165, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/fatwah"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#c3e5a5] text-[#c3e5a5] rounded-full font-semibold hover:bg-[#c3e5a5] hover:text-gray-800 transition-all shadow-lg w-full"
                  >
                    Ask Question
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Video */}
            <motion.div
              className="order-1 lg:order-2 relative mx-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ maxWidth: 360 }}
            >
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] w-full"
                animate={{
                  boxShadow: [
                    "0 25px 50px rgba(0, 0, 0, 0.4)",
                    "0 25px 50px rgba(195, 229, 165, 0.15)",
                    "0 25px 50px rgba(0, 0, 0, 0.4)",
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  playsInline
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source
                    src="https://res.cloudinary.com/dwoke3tu3/video/upload/v1757765311/kashmir_events_new_1_nteqfd.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <motion.button
                    onClick={toggleVideo}
                    className="flex items-center justify-center w-20 h-20 bg-black/70 rounded-full text-white hover:bg-black/90 transition-colors"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 15px rgba(195, 229, 165, 0.2)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-10 h-10" />
                    ) : (
                      <Play className="w-10 h-10 ml-1" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={Mufti}
                  alt="Mufti Shamail Nadwi"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#c3e5a5]/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#c3e5a5]/10 rounded-full blur-2xl" />
            </motion.div>

            {/* Right Content */}
            <motion.div
              className="lg:pl-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#c3e5a5] mb-6">
                About Mufti Shamail Ahmad Abdullah Nadwi
              </h2>
              <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed">
                <p>
                  <span className="text-[#c3e5a5] font-semibold">
                    Mufti Shamail Ahmad Abdullah Nadwi
                  </span>{" "}
                  is a distinguished graduate of Darul Uloom Nadwatul Ulama, a
                  renowned Islamic university, where he specialized in Islamic
                  studies. After graduation, he pursued post-graduate studies in
                  Tafseer and Uloomul Quran, further deepening his understanding
                  of Quranic exegesis and the sciences of the Quran. His
                  commitment to Islamic scholarship led him to specialize in
                  Tadreeb Alal Ifta (Mufti) at the same institution.
                </p>
                <p>
                  He is the{" "}
                  <span className="text-[#c3e5a5] font-semibold">
                    founder of Markaz Al-Wahyain
                  </span>
                  , an online Islamic institution established in 2021, offering
                  quality education to students globally. He also founded
                  Wahyain Foundation, a charitable Islamic trust established in
                  2024, providing educational and welfare services.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#c3e5a5] text-gray-800 rounded-lg font-semibold hover:bg-[#a1c780] transition-all"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/fatwah"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#c3e5a5] text-[#c3e5a5] rounded-lg font-semibold hover:bg-[#c3e5a5] hover:text-gray-800 transition-all"
                >
                  Ask a Question
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* All Books Section */}
      <section id="books" className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#c3e5a5] mb-4">
              Our Book Collection
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
              Explore our carefully curated collection of Islamic literature,
              designed to deepen your understanding of faith and provide
              practical guidance for daily life.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {(books || []).map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* More Books Coming Soon */}
      <section className="relative py-16 md:py-24">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1a1f17] bg-gradient-to-r from-[#c3e5a5]/20 to-[#c3e5a5]/5 bg-clip-text">
            More Books Coming Soon
          </h2>
          <p className="text-gray-500 mt-4 text-lg">
            Stay tuned for upcoming releases that will further enrich your
            Islamic knowledge
          </p>
        </motion.div>
      </section>

      {/* Recent Articles Section */}
      {articles.length > 0 && (
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#0f1a0a] to-[#121510]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#c3e5a5] mb-4">
                Latest Articles
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
                Discover insightful articles and scholarly writings that provide
                guidance and wisdom for your spiritual journey.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {(articles || []).map((article, index) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#c3e5a5] text-gray-800 rounded-full font-semibold hover:bg-[#a1c780] transition-all transform hover:scale-105 shadow-lg"
              >
                View All Articles
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Books;
