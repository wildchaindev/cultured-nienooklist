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

	static mint_metadata(imports) {
		return fcl.transaction`
				${DappTransactions.injectImports(imports)}
				transaction {
				${DappTransactions.injectImports(imports)}
				    // If the person executing this transaction doesn't have access to the
				${DappTransactions.injectImports(imports)}
				    // resource, then the transaction will fail. Thus, references...
				    let receiverRef: &{DappState.NFTReceiver}
				    let minterRef: &DappState.NFTMinter
				
				    // ...in "prepare", the code borrows capabilities on the two resources referenced above,
				${DappTransactions.injectImports(imports)}
				    // takes in information of the person executing the transaction, and validates.
				    prepare(acct: AuthAccount) {
				        self.receiverRef = acct.getCapability<&{DappState.NFTReceiver}>(/public/NFTReceiver)
				            .borrow()
				            ?? panic("Could not borrow minter reference.")
				
				        self.minterRef = acct.borrow<&DappState.NFTMinter>(from: /storage/DappStateMinter)
				            ?? panic("Could not borrow minter reference.")
				    }
				
				    // Currently hardcoded metadata to an example Tweet. Next update will tackle automation of metadata insertion.
				    execute {
				        let metadata : {String : String} = {
				            "author": "sandiegozoo",
				            "text": "So long Twitter crop",
				            "lang": "eng",
				            "date": "2021-04-27 22:19:41",
				            "retweet_count": "165",
				            "favorite_count": "1442",
				            "id_str": "1390376068733804545",
				            // This field points to the IPFS CID hash that hosts the asset media file associated with this NFT! 
				            "uri": "ipfs://QmPa8faoxcurmNwz9vyMPw129N76ifozNMCXLCPMVCbWXm"
				            // NOTE: "ipfs://[CID]" is the standard way to reference a file on IPFS.
				        }
				        // This is where the NFT resource itself is created
				        let newNFT <- self.minterRef.mintNFT()
				
				        // This is where the metadata comes into the picture to join with the new NFT!
				        self.receiverRef.deposit(token: <-newNFT, metadata: metadata)
				
				        log("NFT has been minted and deposited to Account's Collection")
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
				        self.minterRef = acct.borrow<&DappState.NFTMinter>(from: /storage/DappStateMinter)
				            ?? panic("could not borrow minter reference")
				        // TODO: Event handling is not fully implemented
				        //emit DappState.InitializeAccount(acct.address : String)
				    }
				
				    execute {
				        // Use the minter reference to mint an NFT, which deposits
				        // the NFT into the collection that is sent as a parameter.
				        let metadata : {String : String} = {
				            "author": "sandiegozoo",
				            "text": "So long Twitter crop",
				            "lang": "eng",
				            "date": "2021-04-27 22:19:41",
				            "retweet_count": "165",
				            "favorite_count": "1442",
				            "id_str": "1390376068733804545",
				            // This field points to the IPFS CID hash that hosts the asset media file associated with this NFT! 
				            "uri": "ipfs://QmPa8faoxcurmNwz9vyMPw129N76ifozNMCXLCPMVCbWXm"
				            // NOTE: "ipfs://[CID]" is the standard way to reference a file on IPFS.
				        }
				        // This is where the NFT resource itself is created
				        let newNFT <- self.minterRef.mintNFT()
				
				        // This is where the metadata comes into the picture to join with the new NFT!
				        self.receiverRef.deposit(token: <-newNFT, metadata: metadata)
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
				        return self.receiverRef.getIDs()
				    }
				}
		`;
	}

	static transfer_test(imports) {
		return fcl.transaction`
				${DappTransactions.injectImports(imports)}
				transaction(nftId: UInt64, receiver: Address) {
				
				    // The field that will hold the NFT as it is being
				    // transferred to the other account
				    let transferToken: @DappState.NFT
					
				    prepare(acct: AuthAccount) {
				
				        // Borrow a reference from the stored collection
				        let collectionRef = acct.borrow<&DappState.Collection>(from: /storage/DappStateCollection)
				            ?? panic("Could not borrow a reference to the owner's collection")
				        
				        // Call the withdraw function on the sender's Collection
				        // to move the NFT out of the collection
				        self.transferToken <- collectionRef.withdraw(withdrawID: nftId)
				    }
				
				    execute {
				        // Get the recipient's public account object
				        let recipient = getAccount(receiver)
				
				        // Get the Collection reference for the receiver
				        // getting the public capability and borrowing a reference from it
				        let receiverRef = recipient.getCapability<&{DappState.NFTReceiver}>(/public/NFTReceiver)
				            .borrow()
				            ?? panic("Could not borrow receiver reference")
				
				        // Deposit the NFT in the receivers collection
				        receiverRef.deposit(token: <-self.transferToken, metadata: {})
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
