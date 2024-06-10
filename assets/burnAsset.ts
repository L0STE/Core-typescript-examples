import { createSignerFromKeypair, signerIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { burn, fetchAsset, fetchCollection } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';

import wallet from "../wallet.json";

const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));

(async () => {

    // Pass and Fetch the Asset
    const asset = publicKey("...");
    const fetchedAsset = await fetchAsset(umi, asset);
    
    // [?] Pass and Fetch the Collection if the Asset belongs to a Collection
    // const collection = publicKey("...");    
    // const fetchedCollection = await fetchCollection(umi, collection);         

    // Burn the Asset
    const tx = await burn(umi, {
        asset: fetchedAsset,
        // [?] collection: fetchedCollection,
    }).sendAndConfirm(umi)

    // Deserialize the Signature from the Transaction
    const signature = base58.deserialize(tx.signature)[0];
    console.log(`Asset burned: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

})();

/*

    BurnV1 Instruction:
    -----------------------------------
    Accounts:
    - asset: PublicKey | Pda;                            // The address of the asset     
    - collection?: PublicKey | Pda;                      // [?] The collection to which the asset belongs
    - authority?: Signer;                                // [?] The owner or delegate of the asset
    - payer?: Signer;                                    // [?] The account paying for the fees

    Data:
    - compressionProof?: OptionOrNullable<CompressionProofArgs>;

*/