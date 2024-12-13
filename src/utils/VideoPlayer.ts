import dashjs from "dashjs";
import Hls from "hls.js";

export class VideoPlayer {
	private source: string;
	private video: HTMLVideoElement | null;
	private videoContainer: HTMLDivElement | null;
	private hlsInstance: Hls | null;
	private dashInstance: dashjs.MediaPlayerClass | null;
	private qualityLevels: Array<{ bitrate: number; height?: number; width?: number }> | null;

	constructor(source: string) {
		this.source = source;
		this.video = null;
		this.videoContainer = null;
		this.hlsInstance = null;
		this.dashInstance = null;
		this.qualityLevels = null; // Initialize the private variable
	}

	public getSource(): string {
		return this.source;
	}

	public getVideo(): HTMLVideoElement | null {
		return this.video;
	}

	public getHlsInstance(): Hls | null {
		return this.hlsInstance;
	}


	public getDashInstance(): dashjs.MediaPlayerClass | null {
		return this.dashInstance;
	}

	public getVideoContainer(): HTMLDivElement | null {
		return this.videoContainer;
	}

	public getQualityLevels(): Array<{ bitrate: number; height?: number; width?: number }> | null {
		return this.qualityLevels;
	}

	public setVideoSource(source: string): void {
		if (this.video) {
			if (this.isHls(source)) {
				this.loadHls(source);
			} else if (this.isDash(source)) {
				this.loadDash(source);
			} else if (this.isMp4(source)) {
				this.video.src = source;
			} else {
				console.error("Unsupported video format");
			}
		}
	}

	// Set the video element
	public setVideo(video: HTMLVideoElement): void {
		this.video = video;
	}

	// Set the video container
	public setVideoContainer(videoContainer: HTMLDivElement): void {
		this.videoContainer = videoContainer;
	}

	// Helper method to detect HLS format
	private isHls(source: string): boolean {
		return source.endsWith(".m3u8");
	}

	// Helper method to detect DASH format
	private isDash(source: string): boolean {
		return source.endsWith(".mpd");
	}

	// Helper method to detect MP4 format
	private isMp4(source: string): boolean {
		return source.endsWith(".mp4") || source.endsWith(".webm") || source.endsWith(".ogg");
	}

	// Load HLS stream using hls.js
	private loadHls(source: string): void {
		if (Hls.isSupported()) {
			const hls = new Hls();
			hls.loadSource(source);
			hls.attachMedia(this.video!);

			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				console.log("HLS stream loaded");
			});

			// Fetch quality levels for HLS
			hls.on(Hls.Events.LEVEL_LOADED, (_) => {
				this.qualityLevels = hls.levels.map((level: any) => ({
					bitrate: level.bitrate,
					width: level.width,
					height: level.height,
				}));
				console.log("HLS Quality Levels:", this.qualityLevels);
			});

			this.hlsInstance = hls;
		} else {
			console.error("HLS is not supported in this browser.");
		}
	}

	// Load DASH stream using dash.js
	private loadDash(source: string): void {
		const player = dashjs.MediaPlayer().create();
		player.initialize(this.video!, source, true);

		// Fetch quality levels for DASH
		player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
			const videoBitrates = player.getBitrateInfoListFor("video");
			this.qualityLevels = videoBitrates.map((bitrateInfo) => ({
				bitrate: bitrateInfo.bitrate,
				width: bitrateInfo.width,
				height: bitrateInfo.height,
			}));
			console.log("DASH Quality Levels:", this.qualityLevels);
		});

		this.dashInstance = player;
		console.log("DASH stream loaded");
	}
}
