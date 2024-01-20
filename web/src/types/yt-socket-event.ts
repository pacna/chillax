import { YTPlayerState } from "./yt-player-state";

export type YTSocketEvent = {
    videoId: string;
    state: YTPlayerState;
    currentTime: number;
};
