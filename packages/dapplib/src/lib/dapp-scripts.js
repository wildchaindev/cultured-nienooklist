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

	static getID(imports) {
		return fcl.script`
				${DappScripts.injectImports(imports)}
				pub fun main() : [UInt64]?{
				
				    // Get both public account objects
				    let account1 = getAccount(0x01cf0e2f2f715450)
				
				    // Find the public Receiver capability for their Collections
				    let acct1Capability = account1.getCapability(/public/NFTReceiver)
				
				    // borrow references from the capabilities
				    let receiver1Ref = acct1Capability.borrow<&{DappState.NFTReceiver}>()
				        ?? panic("Could not borrow account 1 receiver reference")
				
				    // Print both collections as arrays of IDs
				    return receiver1Ref.getIDs()
				}
				
		`;
	}

	static testGetID(imports) {
		return fcl.script`
				
				${DappScripts.injectImports(imports)}
				pub fun main(account: Address) : [UInt64]?{
				
				    // Get both public account objects
				    let account1 = getAccount(account)
				
				    // Find the public Receiver capability for their Collections
				    let acct1Capability = account1.getCapability(/public/NFTReceiver)
				
				    // borrow references from the capabilities
				    let receiver1Ref = acct1Capability.borrow<&{DappState.NFTReceiver}>()
				        ?? panic("Could not borrow account 1 receiver reference")
				
				    // Print both collections as arrays of IDs
				    return receiver1Ref.getIDs()
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
