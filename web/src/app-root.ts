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

    displayContent(): TemplateResult {
        if (this._ytId) {
            return html`<yt-player .videoId=${this._ytId} />`;
        }

        return html` <yt-form @launched=${this.handleLoaded} /> `;
    }

    handleLoaded(event: CustomEvent): void {
        this._ytId = event.detail.id;
    }

    render(): TemplateResult {
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
