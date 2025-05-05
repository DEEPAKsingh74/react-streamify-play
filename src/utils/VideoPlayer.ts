// Import only types to avoid bundling the entire libraries
import type dashjs from 'dashjs';
import type HlsType from 'hls.js';

export class VideoPlayer {
  private source: string;
  private video: HTMLVideoElement | null;
  private videoContainer: HTMLDivElement | null;
  private hlsInstance: HlsType | null;
  private dashInstance: dashjs.MediaPlayerClass | null;
  private qualityLevels: Array<{ bitrate: number; height?: number; width?: number }> | null;

  constructor(source: string) {
    this.source = source;
    this.video = null;
    this.videoContainer = null;
    this.hlsInstance = null;
    this.dashInstance = null;
    this.qualityLevels = null;
  }

  public getSource(): string {
    return this.source;
  }

  public getVideo(): HTMLVideoElement | null {
    return this.video;
  }

  public getHlsInstance(): HlsType | null {
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
    this.source = source;

    if (this.video) {
      if (this.isHls(source)) {
        this.loadHls(source);
      } else if (this.isDash(source)) {
        this.loadDash(source);
      } else if (this.isMp4(source)) {
        this.video.src = source;
      } else {
        console.error('Unsupported video format');
      }
    } else {
      console.error('Video element is not set.');
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

  // Helper methods to detect video formats
  private isHls(source: string): boolean {
    return source.endsWith('.m3u8');
  }

  private isDash(source: string): boolean {
    return source.endsWith('.mpd');
  }

  private isMp4(source: string): boolean {
    return (
      source.endsWith('.mp4') ||
      source.endsWith('.webm') ||
      source.endsWith('.ogg')
    );
  }

  // Load HLS stream using hls.js
  private async loadHls(source: string): Promise<void> {
    if (!this.video) {
        console.error('Video element is not set.');
        return;
    }

    const HlsModule = await import('hls.js');
    const Hls = HlsModule.default;

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.attachMedia(this.video);
        hls.loadSource(source);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS stream loaded');
        });

        // Fetch quality levels for HLS
        hls.on(Hls.Events.LEVEL_LOADED, () => {
            this.qualityLevels = hls.levels.map((level) => ({
                bitrate: level.bitrate,
                width: level.width,
                height: level.height,
            }));
            console.log('HLS Quality Levels:', this.qualityLevels);
        });

        this.hlsInstance = hls;
    } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for browsers with native HLS support
        this.video.src = source;
    } else {
        console.error('HLS is not supported in this browser.');
    }
}


  // Load DASH stream using dash.js
  private async loadDash(source: string): Promise<void> {
    if (!this.video) {
      console.error('Video element is not set.');
      return;
    }

    const dashjsModule = await import('dashjs');
    const dashjs: typeof import('dashjs') = dashjsModule.default || dashjsModule;

    const player = dashjs.MediaPlayer().create();
    player.initialize(this.video, source, true);

    // Fetch quality levels for DASH
    player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
      const videoBitrates = player.getBitrateInfoListFor('video');
      this.qualityLevels = videoBitrates.map((bitrateInfo) => ({
        bitrate: bitrateInfo.bitrate,
        width: bitrateInfo.width,
        height: bitrateInfo.height,
      }));
      console.log('DASH Quality Levels:', this.qualityLevels);
    });

    this.dashInstance = player;
    console.log('DASH stream loaded');
  }
}