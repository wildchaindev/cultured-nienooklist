import DappLib from "@decentology/dappstarter-dapplib";
import DOM from "../../lib/components/shared/dom";
import "../../lib/components/shared/action-card.js";
import "../../lib/components/shared/action-button.js";
import "../../lib/components/widgets/text-widget.js";
import "../../lib/components/widgets/number-widget.js";
import "../../lib/components/widgets/account-widget.js";
import "../../lib/components/widgets/upload-widget.js";
import sd from "../assets/img/ZooLogos/SanDiego.png";
import bronx from "../assets/img/ZooLogos/bronx.png";
import oak from "../assets/img/ZooLogos/Oakland.png";
import elm from "../assets/img/ZooLogos/Elmswood.png";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("dapp-page")
export default class DappPage extends LitElement {
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
    //let result = DappLib.mintNFT();
    //console.log(result);
  }

  getPages() {
    return[
    {
        "name": "nft",
        "title": "NFT Collection",
        "description": "Test NFT Collection viewing page.",
        "category": "Non-fungible Tokens",
        "route": "/nft"
    }
  ]; 
  }

  handleClick = e => {
    e.preventDefault();
    console.log("E: " + e.target.dataset.link);
    this.setPageLoader(e.target.dataset.link);
  };

  setPageLoader(name) {
    let pageLoader = document.getElementById("page-loader");
    pageLoader.load(name, this.getPages());
    this.requestUpdate();
  }

  render() {
    let content = html`
      <div class="container m-auto">
        <div class="row fadeIn mt-3 p-2 block">
          <h2 class="text-6xl">Wildchain Prototype</h2>
          <h3 class="mt-3 text-3xl">Next Steps</h3>
          <ul class="mt-3 ml-5 list-decimal">
            <li class="mt-3">Interact with the feature modules you selected with the UI Harness</li>
            <li class="mt-3">Customize this page by editing <i>packages/client/src/pages/dapp.js</i></li>
          </ul>
          <div class="row">
            <div id="sdbutton" class="column">
              ${this.getPages().map(page => html`
              <button>
                <img 
                  src=${sd} 
                  width="133" 
                  alt="SDZooLogo" 
                  title="SDZoo" 
                  @click=${this.handleClick} 
                  data-link=${page.name}>
                </img>`)}
              </button>
              <input 
                type="hidden"
                data-field="account"
                value='01cf0e2f2f715450'>
              <action-button
                  source="#sdbutton"
                  title="Mint NFT"
                  description="Mints an NFT"
                  action="mintNFT"
                  method="post"
                  fields="account"
                  text="Mint NFT"
                  class="mt-4"
                  .click=${this.testMint}
                 >
                </action-button¯>    
            </div>
            <div class="column">
              <img src=${bronx} width="133" alt="BronxZooLogo" title="BronxZoo"/>
            </div>
            <div class="column">
              <img src=${oak} width="133" alt="OakZooLogo" title="OakZoo"/>
            </div>
            <div class="column">
              <img src=${elm} width="133" alt="ElmZooLogo" title="ElmZoo"/>
            </div>
          </div>
        </div>
        <div class="container m-auto">
        
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
          </div>
      </div>
    `;
    return content;

  }
}
