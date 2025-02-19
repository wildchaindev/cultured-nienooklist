'use strict';
const Blockchain = require( './blockchain');
const dappConfig = require( '../dapp-config.json');
const ClipboardJS = require( 'clipboard');
const SvgIcons = require( './components/svg-icons');
const BN = require('bn.js'); // Required for injected code

const fcl = require('@onflow/fcl');


module.exports = class DappLib {

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NFT: BASIC  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
static async deploy(data) {
    console.log("Testing Deploy");
    console.log(data.account);
    console.log("1: " + typeof data.account);
    let address = data.account.replace(/^0x/, '');
    let result = await Blockchain.deployContract(
            {config: DappLib.getConfig()},
            address,
            "DappState",
        //'/../../dapplib/contracts/DappState.cdc'
        `pub contract DappState {


            // Declare the NFT resource type
              pub resource NFT {
                  // The unique ID that differentiates each NFT
                  pub let id: UInt64
          
                  // Initialize fields in the init function
                  init(initID: UInt64) {
                      self.id = initID
                  }
              }
          
              // We define this interface purely as a way to allow users
              // to create public, restricted references to their NFT Collection.
              // They would use this to only expose the deposit, getIDs,
              // idExists, and getMetadata fields in their Collection
              pub resource interface NFTReceiver {
          
                  pub fun deposit(token: @NFT, metadata: {String : String}) 
          
                  pub fun getIDs(): [UInt64]
          
                  pub fun idExists(id: UInt64): Bool
          
                  pub fun getMetadata(id: UInt64): {String : String}
              }
          
              // The definition of the Collection resource that
              // holds the NFTs that a user owns
              pub resource Collection: NFTReceiver {
                  // dictionary of NFT conforming tokens
                  // NFT is a resource type with an UInt64 ID field
                  
                  // ownedNFTs keeps track of all NFTs a user owns 
                  pub var ownedNFTs: @{UInt64: NFT}
          
                  // metadataObjs extends Flow NFT contract functionality to 
                  // map an NFT's token id to its associated metadata--
                  // which means you need the NFT's token id before you can set this var.
                  pub var metadataObjs: {UInt64: {String : String}}
          
                  // Initialize the ownedNFTs field to an empty collection (for NFTs),
                  // and the metadataObjs field to an empty dictionary (for Strings)
                  init () {
                      self.ownedNFTs <- {}
                      self.metadataObjs = {}
                  }
          
                  // withdraw 
                  //
                  // Function that removes an NFT from the collection 
                  // and moves it to the calling context
                  pub fun withdraw(withdrawID: UInt64): @NFT {
                      // If the NFT isn't found, the transaction panics and reverts
                      let token <- self.ownedNFTs.remove(key: withdrawID)!
          
                      return <-token
                  }
          
                  // deposit 
                  //
                  // Function that takes an NFT and its metadata as an argument, and 
                  // adds the NFT to the collections dictionary and
                  // adds its associated metadata to the metadata dictionary.
                  // NOTE: to make sure that only the minter of the token can add
                  // metadata to the token, the addition of metadata is confined to the minting execution.
                  pub fun deposit(token: @NFT, metadata: {String : String}) {
                      self.metadataObjs[token.id] = metadata
                      self.ownedNFTs[token.id] <-! token
                      // As opposed to this other technique,
                      // adding the new token to the dictionary which removes the old one:
                      //let oldToken <- self.ownedNFTs[token.id] <- token
                      //destroy oldToken
                  }
          
                  pub fun updateMetadata(id: UInt64, metadata: {String: String}) {
                      self.metadataObjs[id] = metadata
                  }
          
                  pub fun getMetadata(id: UInt64): {String : String} {
                      return self.metadataObjs[id]!
                  }
          
                  // idExists checks to see if a NFT 
                  // with the given ID exists in the collection
                  pub fun idExists(id: UInt64): Bool {
                      return self.ownedNFTs[id] != nil
                  }
          
                  // getIDs returns an array of the IDs that are in the collection
                  pub fun getIDs(): [UInt64] {
                      return self.ownedNFTs.keys
                  }
          
                  destroy() {
                      destroy self.ownedNFTs
                  }
              }
          
              // creates a new empty Collection resource and returns it 
              pub fun createEmptyCollection(): @Collection {
                  return <- create Collection()
              }
          
              // NFTMinter
              //
              // Resource that would be owned by an admin or by a smart contract 
              // that allows them to mint new NFTs when needed
              pub resource NFTMinter {
          
                  // the ID that is used to mint NFTs
                  // it is only incremented so that NFT ids remain
                  // unique. It also keeps track of the total number of NFTs
                  // in existence.
                  pub var idCount: UInt64
          
                  init() {
                      self.idCount = 1
                  }
          
                  // mintNFT 
                  //
                  // Function that mints a new NFT with a new ID
                  // and, instead of depositing the NFT into a specific recipient's collection storage location,
                  // just returns the NFT itself!
                  pub fun mintNFT() : @NFT {
          
                      // create a new NFT! This is where the NFT's core ID gets created.
                      // Right now, it's just getting this ID from the idCount field, which
                      // merely increments up with each NFT minted. If we want to create more
                      // complex IDs with hashing etc., this would be the place to put that new ID
                      // generated from that technique.
                      var newNFT <- create NFT(initID: self.idCount)
          
                      // Increments the id so that each ID is unique
                      self.idCount = self.idCount + 1 as UInt64
          
                      return <-newNFT
                  }
              }
          
          
              init() {
          
          
                  // store an empty NFT Collection in account storage
                  self.account.save(<-self.createEmptyCollection(), to: /storage/DappStateCollection)
          
                  // publish a reference to the Collection in storage
                  self.account.link<&{NFTReceiver}>(/public/NFTReceiver, target: /storage/DappStateCollection)
          
                  // store a minter resource in account storage
                  self.account.save(<-create NFTMinter(), to: /storage/DappStateMinter)
          
          
          
              }
          }`
        );
    result.data = Object.assign({}, { // Temporary items (Should be looked at later) v
        address: result.address
    }, result.keys[0]);
    return {
        type: DappLib.DAPP_RESULT_OBJECT,
        label: 'Contract Information',
        result: result.data             //-------------------------------------------^
    }
}

static async getAccountInfo(data) {
    let address = data.account.replace(/^0x/, '');
    let result = await Blockchain.getAccount(DappLib.getConfig(), address); 

    result.data = Object.assign({}, {
        address: result.address,
        balance: result.balance,
    }, result.keys[0]);
    return {
        type: DappLib.DAPP_RESULT_OBJECT,
        label: 'Account Information',
        result: result.data
    }
}

static async initializeAccount(data) {

    let result = await Blockchain.post({
            config: DappLib.getConfig(),
            imports: {
                DappState: "0x01cf0e2f2f715450"
            },
            roles: {
                proposer: data.account
            }
        },
        'basic_nft_initializeAccount'
    );

    // TODO: Event handling not fully implemented
    // DappLib.onInitializeAccount(result => {
    //     let resultPanel = this.querySelector("#resultPanel");
    //     resultPanel.prepend(DappLib.getFormattedResultNode(result));
    //     resultPanel.open();
    // });

    return {
        type: DappLib.DAPP_RESULT_TX_HASH,
        label: 'Transaction Hash',
        result: result.callData.transactionId
    }

}

static async mintNFT(data) {
    console.log("Data val: " + data.account);
    let result = await Blockchain.post({
        config: DappLib.getConfig(),
        imports: {
            DappState: data.account
        },
        roles: {
            proposer: data.account
        }
    },
    'mint_test'
);

return {
    type: DappLib.DAPP_RESULT_TX_HASH,
    label: 'Transaction Hash',
    result: result.callData.transactionId
}
}

// Need to fix (mint test now temporarily making nfts with metadata)
static async mintNFTMeta(data) {
    console.log("Metadata Test Data val: " + data.account);
    let result = await Blockchain.post({
        config: DappLib.getConfig(),
        imports: {
            DappState: data.account
        },
        roles: {
            proposer: data.account
        }
    },
    'mint_metadata'
);

return {
    type: DappLib.DAPP_RESULT_TX_HASH,
    label: 'Transaction Hash',
    result: result.callData.transactionId
}
}

static async mintCustomNFT(data) {
    console.log("Custom Test Data key: " + data.keys);
    console.log("Custom Test Data val: " + data.values);
    let result = await Blockchain.post({
        config: DappLib.getConfig(),
        imports: {
            DappState: data.account
        },
        roles: {
            proposer: data.account
        }
    },
    'mint_custom_metadata',
    {
        KeysData: "data" + data.keys, 
        ValuesData: "data" + data.values
    }
);

return {
    type: DappLib.DAPP_RESULT_TX_HASH,
    label: 'Transaction Hash',
    result: result.callData.transactionId
}
}

static async transferNFT(data) {
    console.log("sender: " + data.sender)
    console.log("receiver: " + data.receiver)
    console.log("id: " + data.id)
    let result = await Blockchain.post({
        config: DappLib.getConfig(),
        imports: {
            DappState: data.sender
        },
        roles: {
            proposer: data.sender, 
            authorizer: data.receiver
        }
    },
    'transfer_test',
    {
        nftID: parseInt(data.id),
        receiver: data.receiver
    }
);

return {
    type: DappLib.DAPP_RESULT_TX_HASH,
    label: 'Transaction Hash',
    result: result.callData.transactionId
}
}

static async getIDs(data) {
    //console.log("Testing ID Get");
    //console.log(data.account);
    //console.log("1: " + typeof data.account);
    //let vTest = [data.account, t.Address];
    //console.log(vTest);
    //data.account = data.account.replace(/^0x/, '');
    //console.log(data.account);
    let result = await Blockchain.get({
            config: DappLib.getConfig(),
            imports: {
                DappState: "0x01cf0e2f2f715450"
            },
            roles: {
                proposer: data.account
            }
        },
        'testGetID', 
        {
            account: data.account
        }
        );

    return {
        type: DappLib.DAPP_RESULT_ARRAY,
        label: 'NFT IDs',
        result: result.callData || []
    }

}

static async getMetadata(data) {
    let result = await Blockchain.get({
            config: DappLib.getConfig(),
            imports: {
                DappState: data.account
            },
            roles: {
                proposer: data.account
            }
        },
        'check_token_metadata', 
        {
            account: data.account,
            nftId: parseInt(data.id)
        }
        );

    return {
        type: DappLib.DAPP_RESULT_OBJECT,
        label: 'NFT Metadata',
        result: result.callData || []
    }

}

static async onInitializeAccount(callback) {
    let params = {};
    DappLib.addEventHandler(null, 'DappState.InitializeAccount', params, callback);
}




/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DAPP LIBRARY  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    static get DAPP_STATE_CONTRACT() {
        return 'dappStateContract'
    }
    static get DAPP_CONTRACT() {
        return 'dappContract'
    }

    static get DAPP_STATE_CONTRACT_WS() {
        return 'dappStateContractWs'
    }
    static get DAPP_CONTRACT_WS() {
        return 'dappContractWs'
    }

    static get DAPP_RESULT_BIG_NUMBER() {
        return 'big-number'
    }

    static get DAPP_RESULT_ACCOUNT() {
        return 'account'
    }

    static get DAPP_RESULT_TX_HASH() {
        return 'tx-hash'
    }

    static get DAPP_RESULT_IPFS_HASH_ARRAY() {
        return 'ipfs-hash-array'
    }

    static get DAPP_RESULT_SIA_HASH_ARRAY() {
        return 'sia-hash-array'
    }

    static get DAPP_RESULT_ARRAY() {
        return 'array'
    }

    static get DAPP_RESULT_OBJECT() {
        return 'object'
    }

    static get DAPP_RESULT_ERROR() {
        return 'error'
    }

    static get SVG_ICONS() {
        return SvgIcons;
    }

    static async addEventHandler(contract, event, params, callback) {
            Blockchain.handleEvent({
                config: DappLib.getConfig(),
                contract: contract,
                params: params || {}
            }, 
            event, 
            (error, result) => {
                                if (error) {
                                    callback({
                                        event: event,
                                        type: DappLib.DAPP_RESULT_ERROR,
                                        label: 'Error Message',
                                        result: error
                                    });    
                                } else {
                                    callback({
                                        event: event,
                                        type: DappLib.DAPP_RESULT_OBJECT,
                                        label: 'Event ' + event,
                                        result: DappLib.getObjectNamedProperties(result)
                                    });    
                                }
                            }
            );
    }

    static getTransactionHash(t) {
        if (!t) { return ''; }
        let value = '';
        if (typeof t === 'string') {                
            value = t;
        } else if (typeof t === 'object') {    
            if (t.hasOwnProperty('transactionHash')) {
                    value = t.transactionHash;       // Ethereum                
            } else {
                value = JSON.stringify(t);
            }
        }
        return value;
    }

    static formatHint(hint) {
        if (hint) {
            return `<p class="mt-3 grey-text"><strong>Hint:</strong> ${hint}</p>`;
        } else {
            return '';
        }
    }

    static formatNumber(n) {
        var parts = n.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `<strong class="p-1 blue-grey-text number copy-target" style="font-size:1.1rem;" title="${n}">${parts.join(".")}</strong>`;
    }

    static formatAccount(a) {
        return `<strong class="green accent-1 p-1 blue-grey-text number copy-target" title="${a}">${DappLib.toCondensed(a, 6, 4)}</strong>${ DappLib.addClippy(a)}`;
    }

    static formatTxHash(a) {
        let value = DappLib.getTransactionHash(a);
        return `<strong class="teal lighten-5 p-1 blue-grey-text number copy-target" title="${value}">${DappLib.toCondensed(value, 6, 4)}</strong>${ DappLib.addClippy(value)}`;
    }

    static formatBoolean(a) {
        return (a ? 'YES' : 'NO');
    }

    static formatText(a, copyText) {
        if (!a) { return; }
        if (a.startsWith('<')) {
            return a;
        }
        return `<span class="copy-target" title="${copyText ? copyText : a}">${a}</span>${DappLib.addClippy(copyText ? copyText : a)}`;
    }

    static formatStrong(a) {
        return `<strong>${a}</strong>`;
    }

    static formatPlain(a) {
        return a;
    }

    static formatObject(a) {
        console.log(a)
        let data = [];
        let labels = [ 'Item', 'Value' ];
        let keys = [ 'item', 'value' ];
        let formatters = [ 'Strong', 'Text-20-5' ];
        let reg = new RegExp('^\\d+$'); // only digits
        for(let key in a) {
            console.log("Key:Value = " + key + ":" + a[key])
            if (!reg.test(key)) {
                data.push({
                    item: key.substr(0,1).toUpperCase() + key.substr(1),
                    value: a[key]
                });
            }
        }
        return DappLib.formatArray(data, formatters, labels, keys);
    }

    static formatArray(h, dataFormatters, dataLabels, dataKeys) {

        let output = '<table class="table table-striped">';

        if (dataLabels) {
            output += '<thead><tr>';
            for(let d=0; d<dataLabels.length; d++) {
                output += `<th scope="col">${dataLabels[d]}</th>`;
            }    
            output += '</tr></thead>';
        }
        output += '<tbody>';
        h.map((item) => {
            output += '<tr>';
            for(let d=0; d<dataFormatters.length; d++) {
                let text = String(dataKeys && dataKeys[d] ? item[dataKeys[d]] : item);
                let copyText =  dataKeys && dataKeys[d] ? item[dataKeys[d]] : item;
                if (text.startsWith('<')) {
                    output += (d == 0 ? '<th scope="row">' : '<td>') + text + (d == 0 ? '</th>' : '</td>');
                } else {
                    let formatter = 'format' + dataFormatters[d];
                    if (formatter.startsWith('formatText')) {
                        let formatterFrags = formatter.split('-');
                        if (formatterFrags.length === 3) {
                            text = DappLib.toCondensed(text, Number(formatterFrags[1]), Number(formatterFrags[2]));
                        } else if (formatterFrags.length === 2) {
                            text = DappLib.toCondensed(text, Number(formatterFrags[1]));
                        }
                        formatter = formatterFrags[0];    
                    }
                    output += (d == 0 ? '<th scope="row">' : '<td>') + DappLib[formatter](text, copyText) + (d == 0 ? '</th>' : '</td>');                        
                }
            }    
            output += '</tr>';
        })
        output += '</tbody></table>';
        return output;
    }

    static getFormattedResultNode(retVal, key) {

        let returnKey = 'result';
        if (key && (key !== null) && (key !== 'null') && (typeof(key) === 'string')) {
            returnKey = key;
        }
        let formatted = '';
        switch (retVal.type) {
            case DappLib.DAPP_RESULT_BIG_NUMBER:
                formatted = DappLib.formatNumber(retVal[returnKey].toString(10));
                break;
            case DappLib.DAPP_RESULT_TX_HASH:
                formatted = DappLib.formatTxHash(retVal[returnKey]);
                break;
            case DappLib.DAPP_RESULT_ACCOUNT:
                formatted = DappLib.formatAccount(retVal[returnKey]);
                break;
            case DappLib.DAPP_RESULT_BOOLEAN:
                formatted = DappLib.formatBoolean(retVal[returnKey]);
                break;
            case DappLib.DAPP_RESULT_IPFS_HASH_ARRAY:
                formatted = DappLib.formatArray(
                    retVal[returnKey],
                    ['TxHash', 'IpfsHash', 'Text-10-5'],
                    ['Transaction', 'IPFS URL', 'Doc Id'],
                    ['transactionHash', 'ipfsHash', 'docId']
                );
                break;
            case DappLib.DAPP_RESULT_SIA_HASH_ARRAY:
                formatted = DappLib.formatArray(
                    retVal[returnKey],
                    ['TxHash', 'SiaHash', 'Text-10-5'],
                    ['Transaction', 'Sia URL', 'Doc Id'],
                    ['transactionHash', 'docId', 'docId']
                );
                break;
            case DappLib.DAPP_RESULT_ARRAY:
                formatted = DappLib.formatArray(
                    retVal[returnKey],
                    retVal.formatter ? retVal.formatter : ['Text'],
                    null,
                    null
                );
                break;
            case DappLib.DAPP_RESULT_OBJECT:
                formatted = DappLib.formatObject(retVal[returnKey]);
                break;
            default:
                formatted = retVal[returnKey];
                break;
        }

        let resultNode = document.createElement('div');
        resultNode.className = `note ${retVal.type === DappLib.DAPP_RESULT_ERROR ? 'bg-red-400' : 'bg-green-400'} m-3 p-3`; 
        let closeMarkup = '<div class="float-right" onclick="this.parentNode.parentNode.removeChild(this.parentNode)" title="Dismiss" class="text-right mb-1 mr-2" style="cursor:pointer;">X</div>';    
        resultNode.innerHTML = closeMarkup + `${retVal.type === DappLib.DAPP_RESULT_ERROR ? '☹️' : '👍️'} ` + (Array.isArray(retVal[returnKey]) ? 'Result' : retVal.label) + ': ' + formatted + DappLib.formatHint(retVal.hint);
        // Wire-up clipboard copy
        new ClipboardJS('.copy-target', {
            text: function (trigger) {
                return trigger.getAttribute('data-copy');
            }
        });

        return resultNode;
    }

    static getObjectNamedProperties(a) {
        let reg = new RegExp('^\\d+$'); // only digits
        let newObj = {};
        for(let key in a) {
            if (!reg.test(key)) {
                newObj[key] = a[key];
            }
        }
        return newObj;
    }
    
    static addClippy(data) {
        let icon = SvgIcons.clippy;
        return icon.replace('<svg ', `<svg data-copy="${data}" `)
    }

    static getAccounts() {
        let accounts = dappConfig.accounts;
        return accounts;
    }

    static fromAscii(str, padding) {

        if (str.startsWith('0x') || !padding) {
            return str;
        }

        if (str.length > padding) {
            str = str.substr(0, padding);
        }

        var hex = '0x';
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            var n = code.toString(16);
            hex += n.length < 2 ? '0' + n : n;
        }
        return hex + '0'.repeat(padding*2 - hex.length + 2);
    };
    
    static toAscii(hex) {
        var str = '',
            i = 0,
            l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i+=2) {
            var code = parseInt(hex.substr(i, 2), 16);
            if (code === 0) continue; // this is added
            str += String.fromCharCode(code);
        }
        return str;
    };

    static toCondensed(s, begin, end) {
        if (!s) { return; }
        if (s.length && s.length <= begin + end) {
            return s;
        } else {
            if (end) {
                return `${s.substr(0, begin)}...${s.substr(s.length-end, end)}`;
            } else {
                return `${s.substr(0, begin)}...`;
            }
        }
    }

    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    static getUniqueId() {
        return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    static getConfig() {
        return dappConfig;
    }

    // Return value of this function is used to dynamically re-define getConfig()
    // for use during testing. With this approach, even though getConfig() is static
    // it returns the correct contract addresses as its definition is re-written
    // before each test run. Look for the following line in test scripts to see it done:
    //  DappLib.getConfig = Function(`return ${ JSON.stringify(DappLib.getTestConfig(testDappStateContract, testDappContract, testAccounts))}`);
    static getTestConfig(testDappStateContract, testDappContract, testAccounts) {

        return Object.assign(
            {}, 
            dappConfig,
            {
                dappStateContractAddress: testDappStateContract.address,
                dappContractAddress: testDappContract.address,
                accounts: testAccounts,
                owner: testAccounts[0],
                admins: [
                    testAccounts[1],
                    testAccounts[2],
                    testAccounts[3]
                ],
                users: [
                    testAccounts[4],
                    testAccounts[5],
                    testAccounts[6],
                    testAccounts[7],
                    testAccounts[8]
                ]
///+test
            }
        );
    }

}