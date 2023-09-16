const axios = require('axios');
const { createInterface } = require('readline');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function askInput() {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = 'Let\'s check if you\'re on the nice list! What\'s your name?\n';
  
  const answer = await new Promise(resolve => {
    readline.question(question, resolve);
  });

  readline.close();
  return answer;
}

async function main() {
  // Ask for name
  const name = await askInput();

  // Create the Merkle Tree for the whole nice list
  const merkleTree = new MerkleTree(niceList);

  // Get proof that name is in the nice list
  const index = niceList.findIndex(n => n === name);
  const proof = merkleTree.getProof(index);

  const { data: gift } = await axios.post(`${serverUrl}/gift`,
    { proof, name }
  );

  console.log({ gift });
}

main();