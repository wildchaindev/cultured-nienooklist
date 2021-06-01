import DappLib from "@decentology/dappstarter-dapplib";
import DOM from "../../../lib/components/shared/dom";
import "../../../lib/components/shared/action-card.js";
import "../../../lib/components/shared/action-button.js";
import "../../../lib/components/widgets/text-widget.js";
import "../../../lib/components/widgets/number-widget.js";
import "../../../lib/components/widgets/account-widget.js";
import "../../../lib/components/widgets/upload-widget.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("test-page")
export default class TestPage extends LitElement {
  @property()
  get;
  @property()
  post;
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }
  constructor(args) {
    super(args);
  }


  render() {
    let content = html`
        <div class="container m-auto">
            <div class="row fadeIn mt-3 p-2 block">
            <p class="mt-3">
                Welcome to the test page!   
                <action-card
                  title="Mint NFT"
                  description="Mints an NFT"
                  action="mintNFT"
                  method="post"
                  fields="account"
                 >
                  <account-widget
                    field="account"
                    label="Account"
                    placeholder="Account address"
                    >
                  </account-widget>
                </action-card>       
            </p>
            </div>
        </div>
    `;
    return content;

  }
}
