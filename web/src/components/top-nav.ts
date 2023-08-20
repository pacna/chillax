import { TemplateResult, html } from "lit";
import { customElement } from "lit/decorators.js";
import { TWElement } from "./tw-element";

@customElement("top-nav")
export class TopNav extends TWElement {
    render(): TemplateResult {
        return html`
            <header
                class="bg-secondary text-black h-[60px] w-full flex justify-center items-center"
            >
                <slot></slot>
            </header>
        `;
    }
}
