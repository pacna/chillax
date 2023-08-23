import { TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import "./components/top-nav";
import "./components/yt-player";
import { TWElement } from "./components/tw-element";

import "@material/web/textfield/outlined-text-field";

@customElement("app-root")
export class AppRoot extends TWElement {
    render(): TemplateResult {
        return html`
            <top-nav>
                <h1 class="text-2xl font-bold">Chillax</h1>
            </top-nav>
            <main class="mt-32 flex justify-center">
                <form>
                    <md-outlined-text-field
                        label="Label"
                        required
                        error-text="Please fill out this field"
                    ></md-outlined-text-field>
                </form>
                <yt-player />
            </main>
        `;
    }
}
