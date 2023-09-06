import { customElement } from "lit/decorators.js";
import { TWElement } from "./tw-element";
import { TemplateResult, html } from "lit";
import "@material/web/textfield/outlined-text-field";
import "@material/web/button/outlined-button";
import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field";
import "@material/web/icon/icon";

@customElement("yt-form")
export class YTForm extends TWElement {
    private _input: MdOutlinedTextField;

    protected firstUpdated(): void {
        this._input = this.shadowRoot.querySelector("md-outlined-text-field");
    }

    private handleSubmit(event: SubmitEvent): void {
        event.preventDefault();
        if (this._input.validity.valid) {
            this.dispatchEvent(
                new CustomEvent("launched", {
                    detail: {
                        id: this.grabYTId(this._input.value),
                    },
                })
            );
            return;
        }

        this._input.reportValidity();
    }

    private grabYTId(link: string): string {
        if (link.includes("v=")) {
            return link.split("v=")[1]; // to handle regular yt video
        }

        return link.split("shorts/")[1]; // to handle yt shorts
    }

    protected render(): TemplateResult {
        return html`
            <form
                class="flex flex-col"
                @submit="${(event: SubmitEvent) => this.handleSubmit(event)}"
            >
                <md-outlined-text-field
                    class="min-w-[400px]"
                    label="Youtube URL"
                    required
                    type="url"
                >
                    <md-icon slot="leadingicon">search</md-icon>
                </md-outlined-text-field>

                <md-outlined-button class="mt-4">Submit</md-outlined-button>
            </form>
        `;
    }
}
