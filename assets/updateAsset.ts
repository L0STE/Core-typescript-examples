import { createSignerFromKeypair, signerIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { update, fetchAsset, fetchCollection, updateAuthority } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';

import wallet from "../wallet.json";

const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));

(async () => {

    // Get and Fetch the Asset
    const asset = publicKey("...");
    const fetchedAsset = await fetchAsset(umi, asset);

    // [?] Get and Fetch the Collection if the Asset belongs to a Collection
    // const collection = publicKey("..."); 
    // const fetchedCollection = await fetchCollection(umi, collection);

    // Update the Asset
    const tx = await update(umi, {
        asset: fetchedAsset,
        // [?] collection: fetchedCollection,
        name: 'My New NFT',
        uri: null,
    }).sendAndConfirm(umi)

    // Deserialize the Signature from the Transaction
    const signature = base58.deserialize(tx.signature)[0];
    console.log(`\nAsset Udpated: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
})();

/*

    UpdateV1 Instruction:
    -----------------------------------
    Accounts:
    - asset: PublicKey;
    - collection?: PublicKey | Pda;
    - aut Signer;
    - payer?: hority?:Signer;

    Data:
    - newName: OptionOrNullable<string>;
    - newUri: OptionOrNullable<string>;
    - newUpdateAuthority?: OptionOrNullable<UpdateAuthorityArgs>;

*/

/*

    Additional Example:
    -----------------------------------
    - Make an Asset Immutable:

        await updateV1(umi, {
            asset: asset,
            newUpdateAuthority: updateAuthority('None'),
            newName: null,
            newUri: null,
        }).sendAndConfirm(umi)

    - Add the Asset to a Collection:

        await updateV1(umi, {
            asset: asset,
            newUpdateAuthority: updateAuthority('Collection', [collection])
            newName: null,
            newUri: null,
        }).sendAndConfirm(umi)
    
*/