require('dotenv').load()
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  process.env.ACCT_NM,
  process.env.RKBY_END
);
const web3 = new Web3(provider); // completely enabled for rinkeby (account info & network/node endpoint)

const deploy = async () => { // designed inside of function to be able to use async await syntax
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account ', accounts[0]);

  const INITIAL_STRING = 'Hi there!';

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
    .send({ gas: '1000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
};
deploy();
