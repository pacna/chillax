import { LitElement, TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";

import "./components/top-nav";

@customElement("app-root")
export class AppRoot extends LitElement {
    render(): TemplateResult {
        return html`
            <top-nav>
                <h1>Chillax</h1>
            </top-nav>
        `;
    }
}
