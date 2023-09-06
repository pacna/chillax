import { TemplateResult, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./components/top-nav";
import "./components/yt-player";
import "./components/yt-form";
import { TWElement } from "./components/tw-element";

@customElement("app-root")
export class AppRoot extends TWElement {
    @state()
    private _ytId: string;

    private _socket: WebSocket;

    connectedCallback(): void {
        super.connectedCallback();
        this.initializeWebSocket();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.closeWebSocket();
    }

    private initializeWebSocket(): void {
        this._socket = new WebSocket("ws://localhost:5000/ws");

        this._socket.addEventListener("open", () => {
            console.log("WebSocket connection opened");
        });

        this._socket.addEventListener("message", (event) => {
            console.log("Received message:", event.data);
            // Handle incoming messages here
        });

        this._socket.addEventListener("close", () => {
            console.log("WebSocket connection closed");
        });

        this._socket.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
        });
    }

    private closeWebSocket(): void {
        if (this._socket) {
            this._socket.close();
        }
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
