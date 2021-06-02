// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// ⚠️ THIS FILE IS AUTO-GENERATED WHEN packages/dapplib/cadence CHANGES
// DO **** NOT **** MODIFY CODE HERE AS IT WILL BE OVER-WRITTEN
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨

const fcl = require("@onflow/fcl");

module.exports = class DappTransactions {

	static basic_nft_initializeAccount(imports) {
		return fcl.transaction`
				
				${DappTransactions.injectImports(imports)}
				transaction {
				    prepare(acct: AuthAccount) {
				
				        // Delete any existing collection
				        let existing <- acct.load<@DappState.Collection>(from: /storage/NFTCollection)
				        destroy existing
				
				        // Create a new empty collection
				        let collection <- DappState.createEmptyCollection()
				
				        // store the empty NFT Collection in account storage
				        acct.save<@DappState.Collection>(<-collection, to: /storage/NFTCollection)
				
				        // create a public capability for the Collection
				        acct.link<&AnyResource{DappState.NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)
				
				        // TODO: Event handling is not fully implemented
				        //emit DappState.InitializeAccount(acct.address : String)
				
				    }
				}
		`;
	}

	static mint_test(imports) {
		return fcl.transaction`
				
				${DappTransactions.injectImports(imports)}
				transaction {
				    // Reference to the collection that will be receiving the NFT
				    let receiverRef: &{DappState.NFTReceiver}
				
				    // Reference to minter in Storage
				    let minterRef: &DappState.NFTMinter
				
				    prepare(acct: AuthAccount) {
				        // Get the owner's collection capability and borrow a referenc
				        self.receiverRef = acct.getCapability<&{DappState.NFTReceiver}>(/public/NFTReceiver)
				            .borrow()
				            ?? panic("Could not borrow receiver reference")
				        
				        // Borrow a capability for the NFTMinter in storage
				        self.minterRef = acct.borrow<&DappState.NFTMinter>(from: /storage/NFTMinter)
				            ?? panic("could not borrow minter reference")
				        // TODO: Event handling is not fully implemented
				        //emit DappState.InitializeAccount(acct.address : String)
				    }
				
				    execute {
				        // Use the minter reference to mint an NFT, which deposits
				        // the NFT into the collection that is sent as a parameter.
				        self.minterRef.mintNFT(recipient: self.receiverRef)
				        self.receiverRef.getIDs()
				        log("NFT Minted and deposited to Admin's Collection")
				    }
				}
		`;
	}

	static mint_test_log(imports) {
		return fcl.transaction`
				
				${DappTransactions.injectImports(imports)}
				transaction {
				    // Reference to the collection that will be receiving the NFT
				    let receiverRef: &{DappState.NFTReceiver}
				
				    // Reference to minter in Storage
				    let minterRef: &DappState.NFTMinter
				
				    prepare(acct: AuthAccount) {
				        // Get the owner's collection capability and borrow a referenc
				        self.receiverRef = acct.getCapability<&{DappState.NFTReceiver}>(/public/NFTReceiver)
				            .borrow()
				            ?? panic("Could not borrow receiver reference")
				        
				        // Borrow a capability for the NFTMinter in storage
				        self.minterRef = acct.borrow<&DappState.NFTMinter>(from: /storage/NFTMinter)
				            ?? panic("could not borrow minter reference")
				        // TODO: Event handling is not fully implemented
				        //emit DappState.InitializeAccount(acct.address : String)
				    }
				
				    execute{
				        // Use the minter reference to mint an NFT, which deposits
				        // the NFT into the collection that is sent as a parameter.
				        self.minterRef.mintNFT(recipient: self.receiverRef)
				        log("NFT Minted and deposited to Admin's Collection")
				        return self.receiverRef.getIDs())
				    }
				}
		`;
	}

	static transfer_test(imports) {
		return fcl.transaction`
				${DappTransactions.injectImports(imports)}
				transaction {
				
				    // The field that will hold the NFT as it is being
				    // transferred to the other account
				    let transferToken: @DappState.NFT
				
				    let nftId: UInt64
					
				    prepare(acct: AuthAccount) {
				
				        // Borrow a reference from the stored collection
				        let collectionRef = acct.borrow<&DappState.Collection>(from: /storage/NFTCollection)
				            ?? panic("Could not borrow a reference to the owner's collection")
				
				        // Call the withdraw function on the sender's Collection
				        // to move the NFT out of the collection
				        self.transferToken <- collectionRef.withdraw(withdrawID: nftId)
				    }
				
				    execute {
				        // Get the recipient's public account object
				        let recipient = getAccount(0x01)
				
				        // Get the Collection reference for the receiver
				        // getting the public capability and borrowing a reference from it
				        let receiverRef = recipient.getCapability<&{ExampleNFT.NFTReceiver}>(/public/NFTReceiver)
				            .borrow()
				            ?? panic("Could not borrow receiver reference")
				
				        // Deposit the NFT in the receivers collection
				        receiverRef.deposit(token: <-self.transferToken)
				
				        log("NFT ID 1 transferred from account 2 to account 1")
				    }
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
