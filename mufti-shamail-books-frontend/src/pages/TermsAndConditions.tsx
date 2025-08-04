import { motion } from "framer-motion";

const TermsAndConditions = () => {
	return (
		<main className="min-h-screen bg-[#121510] pt-24">
			<div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
						Terms and Conditions
					</h1>
					
					<div className="prose prose-lg prose-invert max-w-none">
						<div className="text-gray-300 space-y-6">
							<p className="text-lg">
								Last updated: {new Date().toLocaleDateString()}
							</p>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Acceptance of Terms
								</h2>
								<p>
									By accessing and using Mufti Shamail Books website, you accept and agree to be bound 
									by the terms and provision of this agreement. If you do not agree to abide by the above, 
									please do not use this service.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Use License
								</h2>
								<p>
									Permission is granted to temporarily download one copy of the materials on Mufti Shamail Books 
									website for personal, non-commercial transitory viewing only. This is the grant of a license, 
									not a transfer of title, and under this license you may not:
								</p>
								<ul className="list-disc pl-6 space-y-2 mt-3">
									<li>modify or copy the materials</li>
									<li>use the materials for any commercial purpose or for any public display</li>
									<li>attempt to reverse engineer any software contained on the website</li>
									<li>remove any copyright or other proprietary notations from the materials</li>
								</ul>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Product Information
								</h2>
								<p>
									We strive to provide accurate product descriptions and pricing. However, we do not warrant 
									that product descriptions or other content is accurate, complete, reliable, current, or 
									error-free. Prices and availability are subject to change without notice.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Orders and Payment
								</h2>
								<ul className="list-disc pl-6 space-y-2">
									<li>All orders are subject to acceptance and availability</li>
									<li>We reserve the right to refuse or cancel any order</li>
									<li>Payment must be received before shipment</li>
									<li>Prices are in USD and include applicable taxes</li>
								</ul>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Shipping and Delivery
								</h2>
								<p>
									We will make every effort to deliver products within the estimated timeframe. However, 
									delivery times are estimates and not guaranteed. We are not responsible for delays 
									caused by shipping carriers or circumstances beyond our control.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									User Accounts
								</h2>
								<p>
									When you create an account, you must provide accurate and complete information. You are 
									responsible for maintaining the confidentiality of your account credentials and for all 
									activities that occur under your account.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Prohibited Uses
								</h2>
								<p>You may not use our service:</p>
								<ul className="list-disc pl-6 space-y-2 mt-3">
									<li>For any unlawful purpose or to solicit others to unlawful acts</li>
									<li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
									<li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
									<li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
									<li>To submit false or misleading information</li>
								</ul>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Disclaimer
								</h2>
								<p>
									The materials on Mufti Shamail Books website are provided on an 'as is' basis. 
									Mufti Shamail Books makes no warranties, expressed or implied, and hereby disclaims 
									and negates all other warranties including without limitation, implied warranties or 
									conditions of merchantability, fitness for a particular purpose, or non-infringement 
									of intellectual property or other violation of rights.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Limitations
								</h2>
								<p>
									In no event shall Mufti Shamail Books or its suppliers be liable for any damages 
									(including, without limitation, damages for loss of data or profit, or due to business 
									interruption) arising out of the use or inability to use the materials on the website.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Governing Law
								</h2>
								<p>
									These terms and conditions are governed by and construed in accordance with the laws 
									and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
								</p>
							</section>

							<section>
								<h2 className="text-2xl font-semibold text-[#c3e5a5] mb-4">
									Contact Information
								</h2>
								<p>
									If you have any questions about these Terms and Conditions, please contact us at:
								</p>
								<div className="mt-2">
									<p>Email: legal@muftishamailbooks.com</p>
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

export default TermsAndConditions;
