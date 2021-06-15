import DappLib from "@decentology/dappstarter-dapplib";
import DOM from "../../lib/components/shared/dom";
import "../../lib/components/shared/action-card.js";
import "../../lib/components/shared/action-button.js";
import "../../lib/components/widgets/text-widget.js";
import "../../lib/components/widgets/number-widget.js";
import "../../lib/components/widgets/account-widget.js";
import "../../lib/components/widgets/upload-widget.js";
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
                  title="Deploy Contract"
                  description="Deploys DappState to Account"
                  action="deploy"
                  method="deployContract"
                  fields="account"
                 >
                  <account-widget
                    field="account"
                    label="Account"
                    placeholder="Account address"
                    >
                  </account-widget>
                </action-card>  
                <action-card
                  title="Initialize Account"
                  description="Initializes an account so it can receive a NFT"
                  action="initializeAccount"
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
                <action-card
                  title="Get NFT IDs"
                  description="Gets NFT IDs for Account"
                  action="getIDs"
                  method="get"
                  fields="account"
                 >
                  <account-widget
                    field="account"
                    label="Account"
                    placeholder="Account address"
                    >
                  </account-widget>
                </action-card>
                <action-card
                  title="Transfer NFT"
                  description="Transfer NFT to another account"
                  action="transferNFT"
                  method="post"
                  fields="sender receiver id"
                 >
                 <label for="NFT-ID" class="mt-3"><b>NFT ID</b></label><br>
                 <input
                 type="text"
                 id="NFT-ID"
                 data-field="id"
                 value='1'>
                  <account-widget
                    field="sender"
                    label="Sender"
                    placeholder="Account address"
                    >
                  </account-widget>
                  <account-widget
                    field="receiver"
                    label="Receiver"
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
