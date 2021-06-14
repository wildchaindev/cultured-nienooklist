import DappLib from "@decentology/dappstarter-dapplib";
import DOM from "../../lib/components/shared/dom";
import "../../lib/components/shared/action-card.js";
import "../../lib/components/shared/action-button.js";
import "../../lib/components/widgets/text-widget.js";
import "../../lib/components/widgets/number-widget.js";
import "../../lib/components/widgets/account-widget.js";
import "../../lib/components/widgets/upload-widget.js";
import sd from "../assets/img/ZooLogos/SanDiego.png";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("nft-page")
export default class NftPage extends LitElement {
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
  @property()
  src;

  createRenderRoot() {
    return this;
  }
  constructor(args) {
    super(args);
  }

  handleClick = e => {
    let actionBtn = document.getElementById("IDbtn");
    console.log("Test Result Panel: " + actionBtn.action)
    if (actionBtn.action) {
      let resultPanel = document.getElementById("resultPanel");
      while (resultPanel.firstChild) {
        resultPanel.firstChild.remove()
      }
      let imgPanel = document.getElementById("imgPanel");
      //console.log("Test Result Panel: "+ e.detail.info.type);
      if (e.detail.info.type === DappLib.DAPP_RESULT_ERROR) {
        resultPanel.prepend(e.detail.node);
        //resultPanel.open();
      } else {
        if (this.method === "get" || this.method === 'post' || this.method === "deployContract") {
          let existing = this.querySelectorAll(
            `#card-body-${this.action} .note`
          );
          existing.forEach(el => el.setAttribute("style", "opacity:0.5;"));
          this.querySelector(`#card-body-${this.action}`).append(e.detail.node);
        } else {
          resultPanel.prepend(e.detail.node);
          console.log("Index: " + resultPanel.innerHTML.indexOf("ipfs"))
          if (resultPanel.innerHTML.indexOf("ipfs") > 0){
            let ipfsHash = resultPanel.innerHTML.split("ipfs")[1].split("\"")[0].substring(3);
            //console.log("Hash: " + ipfsHash);
            //console.log("rPanel: " + resultPanel.innerHTML.split("ipfs")[1].split("\"")[0].substring(3));
            //console.log("PanelType: " + imgPanel)
            let nftImage = document.createElement("img");
            nftImage.width = "133";
            nftImage.src = `https://ipfs.io/ipfs/${ipfsHash}/sandiegodisgruntledgiraffe.jpeg`;
            //imgPanel.append(nftImage)
            resultPanel.lastChild.append(nftImage);
            //resultPanel.open();
          }
          else {
            console.log("Default")
            resultPanel.prepend(e.detail.node);
          }
        }
      }
    }
  };

  render() {
    let content = html`
    <page-body
      title="${this.title}"
      category="${this.category}"
      description="${this.description}"
      >
        <div class="container m-auto">
            <div class="row fadeIn mt-3 p-2 block">
            <p class="mt-3">
              Test page for viewing NFT metadata
              <div class="row">
                <img 
                  src=${sd} 
                  id=viewIcon
                  alt="SDZooLogo" 
                  title="SDZoo" 
                  class=center>
                </img>
              </div>
              <div class="row">
              <div id="viewID" class="column">
                <input 
                 type="hidden"
                 data-field="account"
                 value='0x01cf0e2f2f715450'>
                  <action-button
                   id=IDbtn
                   source="#viewID"
                   title="View IDs"
                   description="Views NFT IDs"
                   action="getIDs"
                   method="get"
                   fields="account"
                   .click=${this.handleClick}
                   text="View IDs"
                   class="mt-4"
                  >
                  </action-button>
              </div>
              <div id="viewID" class="column">
                <input 
                 type="hidden"
                 data-field="account"
                 value='0x01cf0e2f2f715450'>
                  <action-button
                   id=IDbtn
                   source="#viewID"
                   title="View Metadata"
                   description="Views NFT Metadata"
                   action="getMetadata"
                   method="get"
                   fields="account"
                   .click=${this.handleClick}
                   text="View Metadata"
                   class="mt-4"
                  >
                  </action-button>
              </div>
              <div id="mintBtn" class="column">
                <input 
                  type="hidden"
                  data-field="account"
                  value='01cf0e2f2f715450'>
                <action-button
                  id=IDbtn
                  source="#mintBtn"
                  title="Mint NFT"
                  description="Mints an NFT"
                  action="mintNFT"
                  method="post"
                  fields="account"
                  text="Mint NFT"
                  class="mt-4">
                  .click=${this.handleClick}
                </action-button>
              </div>
              </div>
            </p>
            </div>
        </div>
      </page-body>
      <page-panel id="resultPanel"></page-panel>
      <page-panel id="imgPanel"></page-panel>
    `;
    return content;

  }
}
