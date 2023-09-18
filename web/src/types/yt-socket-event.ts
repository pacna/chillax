import { YTPlayerState } from "./yt-player-state";

export interface YTSocketEvent {
    videoId: string;
    state: YTPlayerState;
    currentTime: number;
}
