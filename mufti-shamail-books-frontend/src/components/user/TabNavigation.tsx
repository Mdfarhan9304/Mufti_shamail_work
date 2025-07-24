import { User, ShoppingBag, MapPin } from "lucide-react";

interface TabProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
	const tabs = [
		{ id: "profile", label: "Profile", icon: User },
		{ id: "orders", label: "Orders", icon: ShoppingBag },
		{ id: "addresses", label: "Addresses", icon: MapPin },
	];

	return (
		<div className="space-y-2">
			{tabs.map((tab) => {
				const Icon = tab.icon;
				return (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
							activeTab === tab.id
								? "bg-[#c3e5a5] text-gray-800"
								: "text-gray-400 hover:bg-[#24271b]"
						}`}
					>
						<Icon className="w-5 h-5" />
						{tab.label}
					</button>
				);
			})}
		</div>
	);
};

export default TabNavigation;
