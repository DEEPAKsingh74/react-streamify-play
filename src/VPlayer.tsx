import { useEffect, useRef, useState } from "react";
import { controlOptionsEnum, vplayer_props } from "./types/VPlayer_props";
import VideoControls from "./VideoControls";
import { Video } from "./utils/Video";
import "./index.css"

const defaultControlOptions = [
	controlOptionsEnum.PLAY,
	controlOptionsEnum.MUTE,
	controlOptionsEnum.SETTINGS,
	controlOptionsEnum.PICTURE_IN_PICTURE,
	controlOptionsEnum.THEATER_MODE,
	controlOptionsEnum.PREVIOUS,
	controlOptionsEnum.NEXT,
	controlOptionsEnum.SETTINGS,
	controlOptionsEnum.FULLSCREEN
]

const VPlayer = ({

	source,
	controlOptions,
	handleNext,
	handlePrev,
	handleTheaterMode,
	events,
	loadingAsset,
	videoContainerStyles,
	videoStyles,
	VideoHeader

}: vplayer_props) => {
	const [videoInstance, setVideoInstance] = useState<Video | null>(null);
	const [loading, setLoading] = useState<boolean>(true); // Initial loading state is true

	const videoRef = useRef<HTMLVideoElement | null>(null);
	const videoContainerRef = useRef<HTMLDivElement | null>(null);

	controlOptions = controlOptions || defaultControlOptions;

	useEffect(() => {
		if (videoRef.current && videoContainerRef.current) {
			const video = videoRef.current;
			const videoContainer = videoContainerRef.current;

			const videoInstance = new Video(source);
			videoInstance.setVideo(video);
			videoInstance.setVideoContainer(videoContainer);
			videoInstance.initialize();

			setVideoInstance(videoInstance);

			// Add event listeners for video loading events
			const handleLoadedData = () => {
				setLoading(false); // Set loading to false when video is loaded
			};

			const handleError = () => {
				setLoading(false); // Handle errors and stop loading
				console.error("Error loading video");
			};

			// Attach event listeners to the video element
			video.addEventListener("loadeddata", handleLoadedData);
			video.addEventListener("error", handleError);

			document.addEventListener("keydown", videoInstance.handleKeyDown);

			// Cleanup the event listeners on component unmount
			return () => {
				video.removeEventListener("loadeddata", handleLoadedData);
				video.removeEventListener("error", handleError);

				document.removeEventListener("keydown", videoInstance.handleKeyDown);
			};
		}
	}, [source]);

	return (
		<div ref={videoContainerRef}
			className="video-container"
			style={videoContainerStyles}
		>
			<video ref={videoRef}
				style={videoStyles}
				className="video"
				onClick={() => videoInstance?.togglePlay()}
				{...events}
			>
				{/* Video source will be set inside the Video class */}
			</video>

			{loading &&
				<div className="loading-container">
					{loadingAsset || <img src="/loading.gif" alt="Loading" />}
				</div>
			}
			{/* Display loading message if loading is true */}

			{/* Video Controls */}
			{
				videoInstance && (
					<VideoControls
						videoInstance={videoInstance}
						controlOptions={controlOptions}
						handleNext={handleNext}
						handlePrev={handlePrev}
						handleTheaterMode={handleTheaterMode}
					/>
				)
			}

			{/* Video Header */}
			<div className="video-header-wrapper">
				{
					VideoHeader || null
				}
			</div>
		</div>
	);
};

export default VPlayer;
