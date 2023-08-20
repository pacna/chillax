import { LitElement, adoptStyles, unsafeCSS } from "lit";
import tailwindStyle from "../index.css?inline";

export abstract class TWElement extends LitElement {
    connectedCallback(): void {
        super.connectedCallback();
        adoptStyles(this.shadowRoot, [unsafeCSS(tailwindStyle)]);
    }
}
