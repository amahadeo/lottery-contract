const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // we capitalize constructor function
const provider = ganache.provider();
const web3 = new Web3(provider); // initialize instance w/ provider
const { interface, bytecode } = require('../compile')

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!'

beforeEach(async () => {
  // Get a list of all accounts
  // web3.eth.getAccounts()
  //   .then(fetchedAccounts => {
  //     console.log(fetchedAccounts);
  //   })
  accounts = await web3.eth.getAccounts(); // async/await alternative to 'then'

  // Use one off those accounts to deploy the contracts
  inbox = await new web3.eth.Contract(JSON.parse(interface)) // interface is our ABI, bytecode is contract bytecode // instance of Contract constructor
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] }) // arguments = Inbox constructor arguments // deploy initializes contract
    .send({ from: accounts[0], gas: '1000000' }) // account to send transaction from (already supplied and unlocked by ganache) // send actually sends/deploys contract to network

  inbox.setProvider(provider); // addition because of breaking build
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });
  // 2 types => Calling a function (retrieving contract data, free), Sending a transaction to a function (changing contract data, costs money)
  // #call() or #send()
  it('has a default message', async () => { // calling a function/method on the contract is relatively quick but still async
    const message = await inbox.methods.message().call() // first set of arguments are sent to contract respective function, second set customize how function gets called
    assert.equal(message, INITIAL_STRING);
  });

  it('can change the message', async () => { // changing contract data means sending a transaction to a function, this costs money & needs sender, this returns transaction hash
    await inbox.methods.setMessage('bye').send({ from: accounts[0] })
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye')
  })
});
// class Car {
//   park() {
//     return 'stopped';
//   }
//
//   drive() {
//     return 'vroom';
//   }
// }
//
// describe('Car', () => {
//   let car;
//
//   beforeEach(() => {
//     car = new Car();
//   })
//
//   it('can park', () => {
//     assert.equal(car.park(), 'stopped');
//   });
//
//   it('can drive', () => {
//     assert.equal(car.drive(), 'vroom');
//   });
// });
