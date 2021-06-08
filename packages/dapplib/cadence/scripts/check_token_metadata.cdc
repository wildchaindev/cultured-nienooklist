import DappState from 0x01cf0e2f2f715450

pub fun main() : {String : String} {
    // Account that owns the NFT. 
    // In this case, this is the same account as the one that minted the NFT and deployed the contract.
    let nftOwner = getAccount(0x01cf0e2f2f715450)
    log("NFT Owner")
    // Simply borrows all capabilities that are available by access levels as defined by the contract
    let capability = nftOwner.getCapability<&{DappState.NFTReceiver}>(/public/NFTReceiver)

    // Pull out the "borrow()" capability to get the script to borrow from the deployed contract
    let receiverRef = capability.borrow()
        ?? panic("Could not borrow the receiver reference")

    // At this point, we can use any functions available by capabilities as defined by the contract
    // Thus, call the getMetadata function.
    // For the sake of this test, just getting metadata for the NFT with id 1.
    return receiverRef.getMetadata(id: 1)
}