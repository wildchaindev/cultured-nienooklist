
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