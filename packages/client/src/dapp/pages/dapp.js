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
          <div class="row">
            <div id="sdbutton" class="column">
              ${this.getPages().map(page => html`
              <button>
                <img 
                  src=${sd} 
                  id=icon
                  alt="SDZooLogo" 
                  title="SDZoo" 
                  @click=${this.handleClick} 
                  data-link=${page.name}>
                </img>`)}
              </button>    
            </div>
            <div id="brbutton" class="column">
              ${this.getPages().map(page => html`
              <button>
                <img 
                  src=${bronx} 
                  id=icon
                  alt="BronxZooLogo" 
                  title="BronxZoo"
                  @click=${this.handleClick}
                  data-link=${page.name}>
                </img/>`)}
              </button>
            </div>
            <div id="oakbutton" class="column">
              ${this.getPages().map(page => html`
              <button>
                <img 
                  src=${oak} 
                  id=icon
                  alt="OakZooLogo" 
                  title="OakZoo"
                  @click=${this.handleClick}
                  data-link=${page.name}>
                </img/>`)}
              </button>
            </div>
            <div id="elmbutton" class="column">
              ${this.getPages().map(page => html`
              <button>
                <img 
                  src=${elm} 
                  id=icon
                  alt="ElmZooLogo" 
                  title="ElmZoo"
                  @click=${this.handleClick}
                  data-link=${page.name}>
                </img/>`)}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return content;

  }
}
