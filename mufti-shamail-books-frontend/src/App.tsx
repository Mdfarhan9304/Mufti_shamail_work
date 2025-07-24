import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Books from "./pages/Books";
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
import AddAddress from "./pages/AddAddress";
import { GuestCartProvider } from "./contexts/GuestCartContext";
import GuestCheckout from "./pages/GuestCheckout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";

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
						<Route path="/addresses/new" element={<AddAddress />} />
						<Route
							path="/forgot-password"
							element={<ForgotPassword />}
						/>
						<Route
							path="/reset-password/:token"
							element={<ResetPassword />}
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
