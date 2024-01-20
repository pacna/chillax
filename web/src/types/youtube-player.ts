import { YTPlayerState } from "./yt-player-state";

// https://developers.google.com/youtube/iframe_api_reference#Operations
export type YouTubePlayer = {
    videoTitle: string;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): YTPlayerState;
    isMuted(): boolean;
    mute(): void;
    unMute(): void;
    loadVideoById(videoId: string, startSeconds: number): void;
};
