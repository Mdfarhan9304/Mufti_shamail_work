/** @type {import('tailwindcss').Config} */

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		// single component styles
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#0a2540", // Dark navy-blue for depth.
				secondary: "#48CAE4", // Vibrant blue for highlights.
				accent: "#FFB703", // Bold yellow for attention-grabbing elements.
				dark: "#1B263B", // Slightly muted dark for a softer look.
				light: "#F8FAFC", // Modern off-white for contrast.
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"], // Modern, clean look.
				heading: ["Poppins", "sans-serif"], // For headings with a bold personality.
			},
		},
		darkMode: "class",
	},
	plugins: [],
};
