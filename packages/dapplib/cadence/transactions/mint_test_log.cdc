import DappState from 0x01cf0e2f2f715450

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