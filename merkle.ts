


import { MerkleTree } from 'merkletreejs'
import { sha256 } from 'hash.js' 

const toHex = (bytes: number[]) => bytes.map(x => x.toString(16).padStart(2, '0')).join('')
const hash = (message: string) => toHex(sha256().update(message).digest())

const shares = ['share 1 data', 'share 2 data', 'share 3 data', 'share 4 data'].map(x => hash(x))

const tree = new MerkleTree(shares, hash)
const share = shares[2]
const proof = tree.getProof(share) 
console.log(proof)

// SUBMIT SHARE SUMMARY
const root = tree.getRoot().toString('hex') // This will be stored onchain with the summary

// CHALLENGER: A challenge will contain the tree path:
const challengePath = ['right', 'left']

// POOL: The pool will provide a proof for the challenge path and the share itself
// 1. First check the share is valid, ie < difficulty (Not doing this here)

// 2. Check the proof is the correct path
const proofPath = proof.map(x => x.position)
if (proofPath.join(',') !== challengePath.join(',')) {
  throw new Error('Invalid proof')
}

// 3. Check the proof is correct
if (!tree.verify(proof, share, root)) {
  throw new Error('Invalid proof')
}
console.log('Valid Share!')

// Here's what it looks like when it fails
const badShare = hash('Badshare example: some bad data')
console.log('Share is in tree:', tree.verify(proof, badShare, root)) // true



