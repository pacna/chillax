import { TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { TWElement } from "./tw-element";

import "@material/web/slider/slider";
import "@material/web/icon/icon";
import "@material/web/iconbutton/icon-button";
import { YTPlayerEvent, YTPlayerState } from "../types";

@customElement("yt-player")
export class YTPlayer extends TWElement {
    @property({ type: String })
    videoId: string;

    @state()
    showPlay: boolean = false;

    @property({ type: Number })
    currentTime: number = 0;

    private _player: any;

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
                videoId: this.videoId,
                playerVars: {
                    controls: 0,
                    disablekb: 1,
                    rel: 0,
                    mute: 1, // in order for autoplay to work across multiple browsers, video must be muted
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
            if (!this._player || !this.videoId) {
                return;
            }

            this.currentTime = this._player?.getCurrentTime() ?? 0;
            this.dispatchEvent(
                new CustomEvent("updated", {
                    detail: {
                        videoId: this.videoId,
                        state: this._player.getPlayerState(),
                        currentTime: this.currentTime,
                    } as YTPlayerEvent,
                })
            );
        }, 100);
    }

    private onPlayerReady(event: { target: any; data: any }): void {
        if (this.videoId) {
            event.target.loadVideoById(this.videoId);
        }
    }

    private onPlayerStateChange(event: { target: any; data: any }): void {
        if (event.data === YTPlayerState.ENDED) {
            this.stopVideo();
        }
    }

    private pauseVideo(): void {
        this._player.pauseVideo();
        this.showPlay = true;
    }

    private playVideo(): void {
        this._player.playVideo();
        this.showPlay = false;
    }

    private stopVideo(): void {
        this._player.stopVideo();
        this.showPlay = true;
    }

    private updateCurrentProgression(event: PointerEvent): void {
        if (this._player.getPlayerState() !== YTPlayerState.PAUSED) {
            alert(
                'To update the progress bar, just "pause" the video for a moment.'
            );
            return;
        }

        this._player.seekTo((event.target as HTMLInputElement).value);
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
        if (this.showPlay) {
            return html`
                <md-icon-button @click=${this.playVideo}>
                    <md-icon>play_arrow</md-icon>
                </md-icon-button>
            `;
        }

        return html`
            <md-icon-button @click=${this.pauseVideo}>
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
                    <md-slider
                        class="w-[1080px]"
                        @click=${this.updateCurrentProgression}
                        min="0"
                        max=${this._player?.getDuration()}
                        value=${this.currentTime}
                    ></md-slider>
                </section>
            </article>
        `;
    }
}
