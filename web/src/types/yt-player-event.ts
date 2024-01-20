import { YouTubePlayer } from "./youtube-player";
import { YTPlayerState } from "./yt-player-state";

export type YTPlayerEvent = {
    target: YouTubePlayer;
    data: YTPlayerState;
};
