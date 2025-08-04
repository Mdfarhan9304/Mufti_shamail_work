import { motion } from "framer-motion";

const PrivacyPolicy = () => {
	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			<div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
						Privacy Policy
					</h1>
					
					<div className="prose prose-lg prose-invert max-w-none">
						<div className="text-gray-300 space-y-6">
							<p className="text-lg">
								Last updated: {new Date().toLocaleDateString()}
							</p>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Information We Collect
								</h2>
								<p>
									We collect information you provide directly to us, such as when you create an account, 
									make a purchase, or contact us. This may include your name, email address, phone number, 
									shipping address, and payment information.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									How We Use Your Information
								</h2>
								<ul className="list-disc pl-6 space-y-2">
									<li>Process and fulfill your orders</li>
									<li>Send you order confirmations and shipping updates</li>
									<li>Provide customer support</li>
									<li>Improve our services and user experience</li>
									<li>Send promotional emails (with your consent)</li>
								</ul>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Information Sharing
								</h2>
								<p>
									We do not sell, trade, or otherwise transfer your personal information to third parties 
									without your consent, except as described in this policy. We may share information with 
									trusted service providers who assist us in operating our website and conducting business.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Data Security
								</h2>
								<p>
									We implement appropriate security measures to protect your personal information against 
									unauthorized access, alteration, disclosure, or destruction. However, no method of 
									transmission over the internet is 100% secure.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Cookies
								</h2>
								<p>
									We use cookies to enhance your browsing experience, analyze site traffic, and personalize 
									content. You can choose to disable cookies through your browser settings, though this may 
									affect site functionality.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Your Rights
								</h2>
								<p>
									You have the right to access, update, or delete your personal information. You may also 
									opt out of receiving promotional communications from us at any time.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Changes to This Policy
								</h2>
								<p>
									We may update this privacy policy from time to time. We will notify you of any changes 
									by posting the new policy on this page and updating the "Last updated" date.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Contact Us
								</h2>
								<p>
									If you have any questions about this privacy policy, please contact us at:
								</p>
								<div className="mt-2">
									<p>Email: privacy@muftishamailbooks.com</p>
									<p>Phone: +1 (555) 123-4567</p>
								</div>
							</section>
						</div>
					</div>
				</motion.div>
			</div>
		</main>
	);
};

export default PrivacyPolicy;
