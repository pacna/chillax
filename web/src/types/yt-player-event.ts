import { YTPlayerState } from "./yt-player-state";

export interface YTPlayerEvent {
    videoId: string;
    state: YTPlayerState;
    currentTime: number;
}
