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
            <div class="column">
              <img src=${sd} width="133" alt="SDZooLogo" title="SDZoo"/>
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
          title="SanDiegoZoo"
          description="An example of how to query an account during development"
          action="getAccountInfo"
          method="get"
          fields="account"
        >
          <account-widget
            field="account"
            label="Account"
            placeholder="Account address"
          >
          </account-widget>
          </div>
      </div>
    `;
    return content;

  }
}
