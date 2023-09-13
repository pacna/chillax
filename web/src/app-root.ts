import { TemplateResult, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./components/top-nav";
import "./components/yt-player";
import "./components/yt-form";
import { TWElement } from "./components/tw-element";
import { SocketClient } from "./socket-client";

@customElement("app-root")
export class AppRoot extends TWElement {
    @state()
    private _ytId: string;

    private _socket: SocketClient;

    connectedCallback(): void {
        super.connectedCallback();
        this.initializeWebSocket();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this._socket.close();
    }

    private initializeWebSocket(): void {
        this._socket = new SocketClient(import.meta.env.VITE_WS_URL);
        this._socket.send("hi");
        this._socket.handleReceivedMsg((msg: string) => {
            console.log("msg", msg);
        });
    }

    private displayContent(): TemplateResult {
        if (this._ytId) {
            return html`<yt-player .videoId=${this._ytId} />`;
        }

        return html` <yt-form @launched=${this.handleLoaded} /> `;
    }

    private handleLoaded(event: CustomEvent): void {
        this._ytId = event.detail.id;
    }

    protected render(): TemplateResult {
        return html`
            <top-nav>
                <h1 class="text-2xl font-bold">Chillax</h1>
            </top-nav>
            <main class="mt-24 flex justify-center">
                ${this.displayContent()}
            </main>
        `;
    }
}
