import { motion } from "framer-motion";

const ReturnPolicy = () => {
	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			<div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
						Return Policy
					</h1>
					
					<div className="prose prose-lg prose-invert max-w-none">
						<div className="text-gray-300 space-y-6">
							<p className="text-lg">
								Last updated: {new Date().toLocaleDateString()}
							</p>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Return Window
								</h2>
								<p>
									You have 30 days from the date of delivery to return items for a full refund. 
									Items must be returned in their original condition, unused, and in original packaging.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Eligible Items
								</h2>
								<p>The following items are eligible for return:</p>
								<ul className="list-disc pl-6 space-y-2 mt-3">
									<li>Books in original condition with no writing, highlighting, or damage</li>
									<li>Items that were damaged during shipping</li>
									<li>Items that were incorrectly shipped</li>
									<li>Items that significantly differ from their description</li>
								</ul>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Non-Returnable Items
								</h2>
								<p>The following items cannot be returned:</p>
								<ul className="list-disc pl-6 space-y-2 mt-3">
									<li>Books with writing, highlighting, or other markings</li>
									<li>Books with damaged covers or pages (unless damaged during shipping)</li>
									<li>Digital downloads or e-books</li>
									<li>Items returned after 30 days from delivery</li>
									<li>Items without original packaging</li>
								</ul>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									How to Return Items
								</h2>
								<div className="space-y-4">
									<div>
										<h3 className="text-xl font-medium text-white mb-2">Step 1: Contact Us</h3>
										<p>Email us at returns@muftishamailbooks.com with your order number and reason for return.</p>
									</div>
									<div>
										<h3 className="text-xl font-medium text-white mb-2">Step 2: Get Return Authorization</h3>
										<p>We'll provide you with a Return Authorization Number (RAN) and return shipping instructions.</p>
									</div>
									<div>
										<h3 className="text-xl font-medium text-white mb-2">Step 3: Package Items</h3>
										<p>Securely package the items in their original packaging with the RAN clearly marked.</p>
									</div>
									<div>
										<h3 className="text-xl font-medium text-white mb-2">Step 4: Ship Items</h3>
										<p>Ship the items using the provided return label or your preferred shipping method.</p>
									</div>
								</div>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Return Shipping
								</h2>
								<ul className="list-disc pl-6 space-y-2">
									<li>We provide free return shipping for defective or incorrectly shipped items</li>
									<li>Customer is responsible for return shipping costs for other returns</li>
									<li>We recommend using a trackable shipping service</li>
									<li>Items lost during return shipping are the customer's responsibility</li>
								</ul>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Refund Processing
								</h2>
								<p>
									Once we receive and inspect your returned items, we will process your refund within 
									5-7 business days. Refunds will be issued to the original payment method. Please note 
									that it may take additional time for the refund to appear on your statement depending 
									on your payment provider.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Exchanges
								</h2>
								<p>
									We currently do not offer direct exchanges. If you need a different item, please return 
									the original item for a refund and place a new order for the desired item.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Damaged or Defective Items
								</h2>
								<p>
									If you receive a damaged or defective item, please contact us immediately at 
									support@muftishamailbooks.com with photos of the damage. We will provide a 
									replacement or full refund at no cost to you.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									International Returns
								</h2>
								<p>
									International customers are responsible for return shipping costs and any customs 
									fees. Please contact us before returning international orders to ensure proper processing.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Contact Us
								</h2>
								<p>
									If you have any questions about returns or need assistance, please contact us:
								</p>
								<div className="mt-2">
									<p>Email: returns@muftishamailbooks.com</p>
									<p>Phone: +1 (555) 123-4567</p>
									<p>Hours: Monday-Friday, 9 AM - 5 PM EST</p>
								</div>
							</section>
						</div>
					</div>
				</motion.div>
			</div>
		</main>
	);
};

export default ReturnPolicy;
