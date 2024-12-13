import React from "react";

export interface vplayer_props {
	source: string;
	controlOptions?: controlOptionsEnum[];
	handleNext?: () => void;
	handlePrev?: () => void;
	handleTheaterMode?: () => void;
	events?: Record<string, Function>,
	loadingAsset?: React.ReactNode,
	VideoHeader?: React.ReactNode,
	videoContainerStyles?: React.CSSProperties,
	videoStyles?: React.CSSProperties,
}

export enum controlOptionsEnum {
	PLAY = "play",
	PREVIOUS = "previous",
	NEXT = "next",
	MUTE = "mute",
	SETTINGS = "settings",
	PICTURE_IN_PICTURE = "picture-in-picture",
	THEATER_MODE = "theater-mode",
	FULLSCREEN = "fullscreen",
}