import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-element")
export class MyElement extends LitElement {
    protected createRenderRoot(): Element | ShadowRoot {
        return this;
    }

    render() {
        return html`
            <div class="mt-32">
                <p class="text-3xl font-bold underline">Hello world!</p>
            </div>
        `;
    }
}
