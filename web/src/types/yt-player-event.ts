import { YouTubePlayer } from "./youtube-player";
import { YTPlayerState } from "./yt-player-state";

export interface YTPlayerEvent {
    target: YouTubePlayer;
    data: YTPlayerState;
}
