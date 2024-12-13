import { Video } from "../utils/Video";
import { controlOptionsEnum } from "./VPlayer_props";

export interface videoControlProps {
	videoInstance: Video
	controlOptions?: controlOptionsEnum[]
	handleNext?: () => void
	handlePrev?: () => void
	handleTheaterMode?: () => void
}