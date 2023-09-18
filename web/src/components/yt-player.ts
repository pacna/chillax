import { TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { TWElement } from "./tw-element";

import "@material/web/slider/slider";
import "@material/web/icon/icon";
import "@material/web/iconbutton/icon-button";
import {
    ValueChangeDetector,
    YTSocketEvent,
    YTPlayerState,
    YTPlayerEvent,
    YouTubePlayer,
} from "../types";

@customElement("yt-player")
export class YTPlayer extends TWElement {
    @property({ type: Object })
    set incomingEvent(incomingEvent: YTSocketEvent) {
        if (!incomingEvent) return;
        this.handleIncomingEvent(incomingEvent);
    }

    @state()
    private _videoId: string;

    @state()
    private _currentTime: number = 0;

    private _player: YouTubePlayer;

    private _progressInterval: number;

    constructor() {
        super();
        this.loadYoutubeApi();
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.runProgressLoop();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        clearInterval(this._progressInterval);
    }

    private loadYoutubeApi(): void {
        const tag: HTMLScriptElement = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag: HTMLScriptElement =
            document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => this.onYoutubeIframeApiReady();
    }

    private onYoutubeIframeApiReady(): void {
        this._player = new window.YT.Player(
            this.shadowRoot.getElementById("player"),
            {
                height: "640",
                width: "1140",
                videoId: this._videoId,
                playerVars: {
                    // https://developers.google.com/youtube/player_parameters
                    controls: 0,
                    disablekb: 1,
                    rel: 0,
                    mute: 1, // in order for autoplay to work across multiple browsers, video must be muted,
                },
                events: {
                    onReady: this.onPlayerReady.bind(this),
                    onStateChange: this.onPlayerStateChange.bind(this),
                },
            }
        );
    }

    private runProgressLoop(): void {
        this._progressInterval = setInterval(() => {
            if (!this._player || !this._videoId) {
                return;
            }

            this._currentTime = this._player?.getCurrentTime() ?? 0;
        }, 200);
    }

    private onPlayerReady(event: Pick<YTPlayerEvent, "target">): void {
        if (this._videoId) {
            event.target.loadVideoById(this._videoId, this._currentTime);
        }
    }

    private onPlayerStateChange(event: YTPlayerEvent): void {
        if (event.data === YTPlayerState.ENDED) {
            event.target.pauseVideo(); // pausing the video is only way to prevent YT from cueing up another video
        }

        this.syncVideo();
    }

    private syncVideo(): void {
        this.dispatchEvent(
            new CustomEvent("updated", {
                detail: {
                    videoId: this._videoId,
                    state: this._player.getPlayerState(),
                    currentTime: this._player.getCurrentTime(),
                } as YTSocketEvent,
            })
        );
    }

    private updateCurrentProgression(event: PointerEvent): void {
        if (this._player.getPlayerState() !== YTPlayerState.PAUSED) {
            alert(
                'To update the progress bar, just "pause" the video for a moment.'
            );
            return;
        }

        this._player.seekTo(parseInt((event.target as HTMLInputElement).value));
    }

    private handleIncomingEvent(incomingEvent: YTSocketEvent): void {
        if (
            ValueChangeDetector<string>(this._videoId).hasValueAndChanged(
                incomingEvent.videoId
            )
        ) {
            this._videoId = incomingEvent.videoId;
        }

        if (this._player) {
            if (
                ValueChangeDetector<YTPlayerState>(
                    this._player?.getPlayerState()
                ).hasValueAndChanged(incomingEvent.state)
            ) {
                switch (incomingEvent.state) {
                    case YTPlayerState.PLAYING:
                        this._player.playVideo();
                        break;
                    case YTPlayerState.PAUSED:
                    case YTPlayerState.ENDED:
                        this._player.pauseVideo();
                        break;
                    default:
                        break;
                }
            }

            if (
                Math.abs(
                    this._player.getCurrentTime() - incomingEvent.currentTime
                ) > 1
            ) {
                this._player.seekTo(incomingEvent.currentTime);
            }
        }
    }

    private displayToggleVolume(): TemplateResult {
        if (this._player?.isMuted()) {
            return html`
                <md-icon-button @click=${() => this._player.unMute()}>
                    <md-icon>volume_off</md-icon>
                </md-icon-button>
            `;
        }

        return html`
            <md-icon-button @click=${() => this._player.mute()}>
                <md-icon>volume_up</md-icon>
            </md-icon-button>
        `;
    }

    private displayToggleAction(): TemplateResult {
        if (this._player?.getPlayerState() !== YTPlayerState.PLAYING) {
            return html`
                <md-icon-button @click=${() => this._player.playVideo()}>
                    <md-icon>play_arrow</md-icon>
                </md-icon-button>
            `;
        }

        return html`
            <md-icon-button @click=${() => this._player.pauseVideo()}>
                <md-icon>pause</md-icon>
            </md-icon-button>
        `;
    }

    protected render(): TemplateResult {
        return html`
            <article class="animate-fade">
                <h2 class="text-center text-2xl font-bold mb-4">
                    ${this._player?.videoTitle}
                </h2>
                <div id="player" class="pointer-events-none"></div>
                <section class="flex items-center justify-center mt-4">
                    ${this.displayToggleAction()} ${this.displayToggleVolume()}
                    <md-icon-button @click=${this.syncVideo}>
                        <md-icon>sync</md-icon>
                    </md-icon-button>
                    <md-slider
                        class="w-[1040px]"
                        @click=${this.updateCurrentProgression}
                        min="0"
                        max=${this._player?.getDuration()}
                        value=${this._currentTime}
                    ></md-slider>
                </section>
            </article>
        `;
    }
}
