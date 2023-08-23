import { TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TWElement } from "./tw-element";

import "@material/web/slider/slider";

@customElement("yt-player")
export class YTPlayer extends TWElement {
    player: any;

    @property({ type: String })
    videoId: string;

    constructor() {
        super();
        this.videoId = "M7lc1UVf-VE";
        this.loadYoutubeApi();
    }

    loadYoutubeApi(): void {
        const tag: HTMLScriptElement = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag: HTMLScriptElement =
            document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => this.onYoutubeIframeApiReady();
    }

    onYoutubeIframeApiReady(): void {
        this.player = new window.YT.Player(
            this.shadowRoot.getElementById("player"),
            {
                height: "390",
                width: "640",
                videoId: this.videoId,
                playerVars: {
                    controls: 0,
                    disablekb: 1,
                    rel: 0,
                },
                events: {
                    onReady: this.onPlayerReady.bind(this),
                    onStateChange: this.onPlayerStateChange.bind(this),
                },
            }
        );
    }

    onPlayerReady(event: { target: any; data: any }): void {
        this.player.mute(); // atm, only way to get autoplay to work.
        event.target.playVideo();
    }

    onPlayerStateChange(event: { target: any; data: any }): void {
        if (event.data === window.YT.PlayerState.PLAYING) {
            console.log("hi");
        }

        console.log("blah", this.player.getCurrentTime());
    }

    stopVideo(): void {
        this.player.stopVideo();
    }

    render(): TemplateResult {
        return html`
            <div id="player"></div>
            <md-slider class="mt-4 w-[640px]"></md-slider>
        `;
    }
}
