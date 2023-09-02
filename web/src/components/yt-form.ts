import { customElement } from "lit/decorators.js";
import { TWElement } from "./tw-element";
import { TemplateResult, html } from "lit";
import "@material/web/textfield/filled-text-field";
import "@material/web/button/outlined-button";
import { MdFilledTextField } from "@material/web/textfield/filled-text-field";

@customElement("yt-form")
export class YTForm extends TWElement {
    private _input: MdFilledTextField;

    protected firstUpdated(): void {
        this._input = this.shadowRoot.querySelector("md-filled-text-field");
    }

    handleSubmit(event: SubmitEvent): void {
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

    render(): TemplateResult {
        return html`
            <form
                class="flex flex-col"
                @submit="${(event: SubmitEvent) => this.handleSubmit(event)}"
            >
                <md-filled-text-field
                    class="min-w-[400px]"
                    label="Youtube URL"
                    required
                    error-text="Please fill out this field"
                ></md-filled-text-field>

                <md-outlined-button class="mt-4">Submit</md-outlined-button>
            </form>
        `;
    }
}
