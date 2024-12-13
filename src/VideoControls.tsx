import { useEffect, useState } from "react";
import "./index.css";
import {
  Maximize,
  Pause,
  PictureInPicture2,
  Play,
  RectangleHorizontal,
  Settings,
  Shrink,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { controlOptionsEnum } from "./types/VPlayer_props";
import SettingMenu from "./SettingMenu";
import { videoControlProps } from "./types/VControl_props";

const VideoControls = ({
  videoInstance,
  controlOptions,
  handleNext,
  handlePrev,
  handleTheaterMode
}: videoControlProps) => {
  const [controlStates, setControlStates] = useState({
    isPlaying: false,
    isMuted: false,
    isFullScreen: false,
  });

  const [timelineStates, setTimelineStates] = useState({
    isSeeking: false,
    duration: 0,
    currentTime: 0,
    bufferPercent: 0,
    progressPercent: 0,
  });

  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    const video = videoInstance.getVideo();
    const videoContainer = videoInstance.getVideoContainer();

    if (video) {
      const handlePlay = () => {
        setControlStates((prev) => ({
          ...prev,
          isPlaying: !video.paused,
        }));
      };

      const handleMute = () => {
        setControlStates((prev) => ({
          ...prev,
          isMuted: video.muted,
        }));
      };

      const handleFullScreen = () => {
        setControlStates((prev) => ({
          ...prev,
          isFullScreen: videoInstance.isFullScreen(),
        }));
      };

      const handleProgress = () => {
        if (video.buffered.length > 0 && video.duration) {
          const bufferEnd = video.buffered.end(video.buffered.length - 1);
          const bufferPercent = (bufferEnd / video.duration) * 100;
          setTimelineStates((prev) => ({
            ...prev,
            bufferPercent,
          }));
        }
      };

      const handleTimeUpdate = () => {
        if (video.duration) {
          const progressPercent = (video.currentTime / video.duration) * 100;
          setTimelineStates((prev) => ({
            ...prev,
            currentTime: video.currentTime,
            duration: video.duration,
            progressPercent,
          }));
        }
      };

      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePlay);
      video.addEventListener("volumechange", handleMute);
      videoContainer?.addEventListener("fullscreenchange", handleFullScreen);

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("progress", handleProgress);

      return () => {
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePlay);
        video.removeEventListener("volumechange", handleMute);
        videoContainer?.removeEventListener("fullscreenchange", handleFullScreen);

        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("progress", handleProgress);
      };
    }
  }, [videoInstance]);

  const handleSeekStart = (e: React.MouseEvent) => {
    if (!videoInstance.getVideo()) return;

    const video = videoInstance.getVideo();
    const videoContainer = videoInstance.getVideoContainer();

    if (video && videoContainer) {
      const videoRect = video.getBoundingClientRect();
      const offsetX = e.clientX - videoRect.left;
      const seekPercent = (offsetX / videoRect.width) * 100;

      const seekTime = (seekPercent / 100) * video.duration;

      setTimelineStates((prev) => ({
        ...prev,
        isSeeking: true,
      }));

      video.currentTime = seekTime;

      const handleSeekMove = (e: MouseEvent) => {
        const offsetX = e.clientX - videoRect.left;
        const seekPercent = (offsetX / videoRect.width) * 100;

        const seekTime = (seekPercent / 100) * video.duration;

        video.currentTime = seekTime;
      };

      const handleSeekEnd = () => {
        setTimelineStates((prev) => ({
          ...prev,
          isSeeking: false,
        }));

        document.removeEventListener("mousemove", handleSeekMove);
        document.removeEventListener("mouseup", handleSeekEnd);
      };

      document.addEventListener("mousemove", handleSeekMove);
      document.addEventListener("mouseup", handleSeekEnd);
    }
  }

  const toggleSettings = () => {
    setSettingsVisible((prev) => !prev);
  }

  return (
    <div className="video-controls-container">
      <div className="timeline-wrapper"
        onMouseDown={handleSeekStart}
      >
        <div className="timeline">
          {/* buffer-timeline */}
          <div
            className="buffer-timeline"
            style={{ width: `${timelineStates.bufferPercent}%` }}
          />
          {/* progress-timeline */}
          <div
            className="progress-timeline"
            style={{ width: `${timelineStates.progressPercent}%` }}
          />
        </div>
      </div>
      <div className="control-container">
        <div className="control-left">
          {controlOptions?.includes(controlOptionsEnum.PREVIOUS) &&
            (
              handlePrev && <button onClick={handlePrev}><SkipBack /></button>
            )

          }
          {controlOptions?.includes(controlOptionsEnum.PLAY) &&
            (
              <button>{controlStates.isPlaying ? (
                <Pause onClick={() => videoInstance.togglePlay()} />
              ) : (
                <Play onClick={() => videoInstance.togglePlay()} />
              )}</button>
            )
          }
          {controlOptions?.includes(controlOptionsEnum.NEXT) &&
            (
              handleNext && <button onClick={handleNext}><SkipForward /></button>
            )
          }
          {controlOptions?.includes(controlOptionsEnum.MUTE) &&
            (
              <button>{controlStates.isMuted ? (
                <VolumeOff onClick={() => videoInstance.toggleMute()} />
              ) : (
                <Volume2 onClick={() => videoInstance.toggleMute()} />
              )}</button>
            )}

          <div className="time-display">

            <span>{
              formatTime(timelineStates.currentTime)
            }
            </span>
            <span>/</span>
            <span>
              {
                formatTime(timelineStates.duration)
              }
            </span>

          </div>
        </div>
        <div className="control-right">



          {controlOptions?.includes(controlOptionsEnum.SETTINGS) &&
            <div className="setting-wrapper">

              {
                settingsVisible && <SettingMenu videoInstance={videoInstance} />
              }
              <button
                onClick={toggleSettings}
              >
                <Settings />
              </button>
            </div>
          }
          {controlOptions?.includes(controlOptionsEnum.PICTURE_IN_PICTURE) && (
            <button
              onClick={() => videoInstance.togglePictureInPictureMode()}
            ><PictureInPicture2 /></button>
          )}
          {controlOptions?.includes(controlOptionsEnum.THEATER_MODE) && (
            <button
              onClick={handleTheaterMode}
            ><RectangleHorizontal /></button>
          )}
          {controlOptions?.includes(controlOptionsEnum.FULLSCREEN) && (
            <button onClick={() => videoInstance.toggleFullScreenMode()}>
              {controlStates.isFullScreen ? <Shrink /> : <Maximize />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const formatTime = (time: number): string => {

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const displayHours = hours > 0 ? `${hours}:` : "";
  const displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const displaySeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${displayHours}${displayMinutes}:${displaySeconds}`;
}


export default VideoControls;
