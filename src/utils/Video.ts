import { defaultKeyConfig } from "./KeyConfigDefault";
import { VideoPlayer } from "./VideoPlayer";

export class Video extends VideoPlayer {

	constructor(source: string) {
		super(source);
		this.handleKeyDown = this.handleKeyDown.bind(this); // Bind the method here
	}

	initialize(): void {
		this.setVideoSource(this.getSource());
	}

	togglePlay(): void {
		const video = this.getVideo();
		if (video) {
			if (video.paused) {
				video.play();
			} else {
				video.pause();
			}
		}
	}

	toggleMute(): void {
		const video = this.getVideo();
		if (video) {
			video.muted = !video.muted;
		}
	}

	isFullScreen(): boolean {
		const video = this.getVideo();
		if (video) {
			return document.fullscreenElement === this.getVideoContainer();
		}
		return false;
	}

	toggleFullScreenMode(): void {
		const video = this.getVideo();
		if (video) {
			if (this.isFullScreen()) {
				document.exitFullscreen();
			} else {
				this.getVideoContainer()?.requestFullscreen();
			}
		}
	}

	togglePictureInPictureMode(): void {
		const video = this.getVideo();
		if (video) {
			if (document.pictureInPictureElement) {
				document.exitPictureInPicture();
			} else {
				video.requestPictureInPicture();
			}
		}
	}

	getPlaybackQuality(): { label: string, index?: number }[] {
		const video = this.getVideo();
		if (video) {
			const levels = this.getQualityLevels()?.map((quality, index) => ({
				label: `${quality.height}p`,
				index,
			}),);

			if (levels) {
				return levels;
			}
		}
		return [];
	}

	setPlaybackQuality(index: number = -1): void {
		const video = this.getVideo();

		console.log("Setting quality to", index);

		if (video) {
			if (this.getHlsInstance()) {
				this.getHlsInstance()!.loadLevel = index;
			} else if (this.getDashInstance()) {
				this.getDashInstance()!.setQualityFor("video", index);
			}
		}
	}

	setPlaybackRate(rate: string): void {
		const video = this.getVideo();
		if (rate == "Normal") {
			rate = "1";
		}
		if (video) {
			video.playbackRate = parseFloat(rate);
		}
	}

	skipForwardBackward(seconds: number): void {
		const video = this.getVideo();
		if (video) {
			video.currentTime += seconds;
		}
	}


	handleKeyDown(event: KeyboardEvent): void {
		const key = event.key;

		console.log("Key pressed", key);


		if (defaultKeyConfig.PLAY_PAUSE.includes(key)) {
			this.togglePlay();
		} else if (defaultKeyConfig.MUTE.includes(key)) {
			this.toggleMute();
		} else if (defaultKeyConfig.FULLSCREEN.includes(key)) {
			this.toggleFullScreenMode();
		} else if (defaultKeyConfig.PICTURE_IN_PICTURE.includes(key)) {
			this.togglePictureInPictureMode();
		} else if (defaultKeyConfig.THEATER_MODE.includes(key)) {
			// this.toggleTheaterMode();
		} else if (defaultKeyConfig.NEXT.includes(key)) {
			// this.next();
		} else if (defaultKeyConfig.PREVIOUS.includes(key)) {
			// this.previous();
		} else if (defaultKeyConfig.SETTINGS.includes(key)) {
			// this.toggleSettings();
		} else if (defaultKeyConfig.SKIP_FORWARD.includes(key)) {
			this.skipForwardBackward(5);
		} else if (defaultKeyConfig.SKIP_BACKWARD.includes(key)) {
			this.skipForwardBackward(-5);
		}
	}
}