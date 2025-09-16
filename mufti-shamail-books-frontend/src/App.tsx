import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Books from "./pages/Books";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./pages/AdminDashboard";
import ManageBooks from "./pages/ManageBooks";
import AddBook from "./pages/AddBook";
import Dashboard from "./components/user/Dashboard";
import BookPage from "./pages/BookPage";
import Checkout from "./pages/Checkout";
import PaymentStatus from "./pages/PaymentStatus";
import PaymentVerification from "./pages/PaymentVerification";
import AddAddress from "./pages/AddAddress";
import { GuestCartProvider } from "./contexts/GuestCartContext";
import GuestCheckout from "./pages/GuestCheckout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";
import OrderDetails from "./pages/OrderDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ReturnPolicy from "./pages/ReturnPolicy";
import Certifications from "./pages/Certifications";
import FatwahPage from "./pages/FatwahPage";
import AskFatwah from "./pages/AskFatwah";
import ManageFatwahs from "./pages/ManageFatwahs";
import FatwahDetail from "./pages/FatwahDetail";
import Initiatives from "./pages/Initiatives";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import ArticleDashboard from "./pages/admin/ArticleDashboard";
import CreateArticle from "./pages/admin/CreateArticle";
import EditArticle from "./pages/admin/EditArticle";

const AppContent = () => {
	// const location = useLocation();
	// const isErrorPage =
	// 	location.pathname !== "/" &&
	// 	!location.pathname.match(/^\/(?:books|certifications)$/);

	// const menuItemsBase = [
	// 	{ label: "Home", href: "/" },
	// 	{ label: "Certifications", href: "/certifications" },
	// 	{
	// 		label: "Books",
	// 		href: "http://books.localhost:5173",
	// 		className:
	// 			"bg-[#c3e5a5] rounded-md text-gray-800 hover:bg-[#90af75] flex items-center gap-2 px-4 py-2",
	// 		icon: <BookOpen className="w-6 h-6" />,
	// 	},
	// ];

	return (
		<>
			<AuthProvider>
				<GuestCartProvider>
					<ScrollToTop />
					<ScrollToTopButton />
					<ToastContainer
						position="top-right"
						autoClose={3000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>
					{<Navbar />}
					<Routes>
						<Route path="/" element={<Books />} />
						{/* ----- About ----- */}
						<Route path="/about" element={<About />} />
						{/* ----- Certifications ----- */}
						<Route path="/certifications" element={<Certifications />} />
						{/* ----- Initiatives ----- */}
						<Route path="/initiatives" element={<Initiatives />} />
						{/* ----- Login ----- */}
						<Route path="/login" element={<Login />} />
						<Route path="/admin/login" element={<AdminLogin />} />
						{/* ----- Register ----- */}
						<Route path="/register" element={<Register />} />
						{/* ----- Cart ----- */}
						<Route path="/cart" element={<Cart />} />
						{/* ----- Dashboard ----- */}
						<Route path="/dashboard" element={<Dashboard />} />
						{/* ----- Admin Dashboard ----- */}
						<Route
							path="/admin/dashboard"
							element={<AdminDashboard />}
						/>
						{/* ----- Order Details ----- */}
						<Route
							path="/admin/orders/:orderId"
							element={<OrderDetails />}
						/>
						{/* ----- User Order Details ----- */}
						<Route
							path="/order-details/:orderId"
							element={<OrderDetails />}
						/>
						{/* ----- Manage Books ----- */}
						<Route path="/manage-books" element={<ManageBooks />} />
						{/* ----- Add book ----- */}
						<Route path="/add-book" element={<AddBook />} />
						{/* ----- Book Page ------ */}
						<Route path="/book/:bookId" element={<BookPage />} />
						{/* ----- Checkout ----- */}
						<Route path="/checkout" element={<Checkout />} />
						<Route
							path="/guest/checkout"
							element={<GuestCheckout />}
						/>
						{/* ----- Payment Status ----- */}
						<Route
							path="/payment/:txnId"
							element={<PaymentStatus />}
						/>
						<Route
							path="/payment/success"
							element={<PaymentStatus />}
						/>
						<Route
							path="/payment-verification"
							element={<PaymentVerification />}
						/>
						<Route path="/addresses/new" element={<AddAddress />} />
						<Route
							path="/forgot-password"
							element={<ForgotPassword />}
						/>
						<Route
							path="/reset-password/:token"
							element={<ResetPassword />}
						/>
						{/* ----- Policy Pages ----- */}
						<Route
							path="/privacy-policy"
							element={<PrivacyPolicy />}
						/>
						<Route
							path="/terms-and-conditions"
							element={<TermsAndConditions />}
						/>
						<Route
							path="/return-policy"
							element={<ReturnPolicy />}
						/>
						{/* ----- Fatwah Pages ----- */}
						<Route path="/fatwah" element={<FatwahPage />} />
						<Route path="/fatwah/:id" element={<FatwahDetail />} />
						<Route path="/ask-fatwah" element={<AskFatwah />} />
						<Route
							path="/admin/fatwah"
							element={<ManageFatwahs />}
						/>
						{/* ----- Article Pages ----- */}
						<Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
						<Route
							path="/admin/articles"
							element={<ArticleDashboard />}
						/>
						<Route
							path="/admin/articles/create"
							element={<CreateArticle />}
						/>
						<Route
							path="/admin/articles/edit/:id"
							element={<EditArticle />}
						/>
					</Routes>
					<Footer />
				</GuestCartProvider>
			</AuthProvider>
		</>
	);
};

function App() {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
}

export default App;
