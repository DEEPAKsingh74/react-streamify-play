import { useEffect, useState } from "react";
import "./index.css";
import { ChevronRight, CircleChevronLeft } from "lucide-react";
import { Video } from "./utils/Video";

// Define the structure of a menu option
type MenuOption = {
	label: string;
	action?: () => void;
	children?: MenuOption[];
};

const playBackRates = [
	{ label: "0.25x" },
	{ label: "0.5x" },
	{ label: "Normal" },
	{ label: "1.5x" },
	{ label: "2x" },
]

// Example settings menu data
const settingsMenu: MenuOption[] = [
	{
		label: "Playback Quality",
		children: [],
	},
	{
		label: "Playback Speed",
		children: [],
	},
];

const SettingMenu = ({ videoInstance }: { videoInstance: Video }) => {
	const [menuStack, setMenuStack] = useState<MenuOption[][]>([settingsMenu]);

	useEffect(() => {

		const qualities = videoInstance.getPlaybackQuality();
		const qualityOption = settingsMenu.find((option) => option.label === "Playback Quality");
		if (qualityOption) {
			qualityOption.children = qualities.map((quality) => ({
				label: quality.label,
				action: () => {
					videoInstance.setPlaybackQuality(quality.index);
				},
			}));
		}

		const speedOption = settingsMenu.find((option) => option.label === "Playback Speed");
		if (speedOption) {
			speedOption.children = playBackRates.map((rate) => ({
				label: rate.label,
				action: () => {
					videoInstance.setPlaybackRate(rate.label);
				},
			}));
		}


	}, [videoInstance])


	// Current menu options are the last in the stack
	const currentMenu = menuStack[menuStack.length - 1];

	const handleOptionClick = (option: MenuOption) => {
		if (option.children) {
			// Navigate to the next level of the menu
			setMenuStack((prev) => [...prev, option.children!]);
		} else if (option.action) {
			// Perform the action
			option.action();
		}
	};

	const handleBack = () => {
		// Go back to the previous menu
		if (menuStack.length > 1) {
			setMenuStack((prev) => prev.slice(0, -1));
		}
	};

	return (
		<div className="setting-container">
			{/* Back button if not on the root menu */}
			{menuStack.length > 1 && (
				<button className="back-button" onClick={handleBack}>
					<CircleChevronLeft />
				</button>
			)}

			{/* Render current menu options */}
			<ul className="menu-list">
				{currentMenu.map((option, index) => (
					<li
						key={index}
						className={`menu-item ${option.children ? "has-children" : ""}`}
						onClick={() => handleOptionClick(option)}
					>
						<div>
							{option.label}
						</div>
						<div>
							{option.children && <ChevronRight />}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default SettingMenu;