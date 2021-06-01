// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/cadence CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappScripts {

	static basic_nft_getIDs(imports) {
		return fcl.script`
				
				${DappScripts.injectImports(imports)}
				pub fun main(account: Address) : [UInt64]? {
				    let account = getAccount(account)
				    let capability = account.getCapability(/public/NFTReceiver) 
				    let ref = capability.borrow<&{DappState.NFTReceiver}>() ?? panic("Could not borrow account receiver reference")
				
				    return ref?.getIDs()
				}
		`;
	}

	static testGetID(imports) {
		return fcl.script`
				
				// Print the NFTs owned by accounts 0x01 and 0x02.
				${DappScripts.injectImports(imports)}
				pub fun main() {
				
				    // Get both public account objects
				    let account1 = getAccount(0x01cf0e2f2f715450)
				
				    // Find the public Receiver capability for their Collections
				    let acct1Capability = account1.getCapability(/public/NFTReceiver)
				
				    // borrow references from the capabilities
				    let receiver1Ref = acct1Capability.borrow<&{DappState.NFTReceiver}>()
				        ?? panic("Could not borrow account 1 receiver reference")
				
				    // Print both collections as arrays of IDs
				    log("Account 1 NFTs")
				    log(receiver1Ref.getIDs())
				}
				
		`;
	}

      
      static injectImports(imports) {
        let importCode = '';
        if (imports) {
          for(let key in imports) {
            importCode += '				import ' + key + ' from 0x' + imports[key].trim().replace('0x','') + '\n'; 
          };
        }
        return importCode;
      }     

      
}
