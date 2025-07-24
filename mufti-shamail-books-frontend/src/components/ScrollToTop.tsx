import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
	const { pathname } = useLocation();
	const navigationType = useNavigationType();

	useLayoutEffect(() => {
		// Only scroll to top if it's a PUSH navigation (not REPLACE or POP)
		if (navigationType === "PUSH") {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: "instant",
			});
		}
	}, [pathname, navigationType]);

	return null;
};

export default ScrollToTop;
