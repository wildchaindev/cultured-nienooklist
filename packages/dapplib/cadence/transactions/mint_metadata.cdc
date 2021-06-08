import DappState from 0x01cf0e2f2f715450

transaction {
    // If the person executing this transaction doesn't have access to the
    // resource, then the transaction will fail. Thus, references...
    let receiverRef: &{PinataPartyContract.NFTReceiver}
    let minterRef: &PinataPartyContract.NFTMinter

    // ...in "prepare", the code borrows capabilities on the two resources referenced above,
    // takes in information of the person executing the transaction, and validates.
    prepare(acct: AuthAccount) {
        self.receiverRef = acct.getCapability<&{PinataPartyContract.NFTReceiver}>(/public/NFTReceiver)
            .borrow()
            ?? panic("Could not borrow minter reference.")

        self.minterRef = acct.borrow<&PinataPartyContract.NFTMinter>(from: /storage/NFTMinter)
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