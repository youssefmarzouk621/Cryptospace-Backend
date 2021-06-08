require('dotenv').config()

const express = require('express');

const jwt = require('jsonwebtoken')
const { exec } = require('child_process');

const route = express.Router();

const web3 = require('web3');
const VaultCoinArtifact = require('../../build/contracts/VaultCoin.json');
const Tx = require('ethereumjs-tx').Transaction;

const getBalance = async (req,res,next)  => {
  web3js = new web3(new web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/b05dc62351984a3e95cfc176400805aa"
  ));
  var meta=null;
  const networkId = await web3js.eth.net.getId();
  const deployedNetwork = VaultCoinArtifact.networks[networkId];
  
  meta = new web3js.eth.Contract(
      VaultCoinArtifact.abi,
      deployedNetwork.address,
  );

  const { balanceOf } = meta.methods;
  const balance = await balanceOf(req.body.account).call();
  res.status(200).send(JSON.stringify(
      {
        balance:balance,
        balanceVaultWei:web3.utils.fromWei(balance, "ether"),
      }
    )
  )

}

const sendCoin = async (req,res,next)  => {
  web3js = new web3(new web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/b05dc62351984a3e95cfc176400805aa"
  ));
  var meta=null;
  const networkId = await web3js.eth.net.getId();
  const deployedNetwork = VaultCoinArtifact.networks[networkId];
  
  meta = new web3js.eth.Contract(
      VaultCoinArtifact.abi,
      deployedNetwork.address,
  );

  const { transfer } = meta.methods;
  const { balanceOf } = meta.methods;

  const privateKey1 = '0e42ff8df9905b203a0260410dbbfd602b23e894824a2a8c537a4283826019c2'
  const privateKey1Buffer = Buffer.from(privateKey1, 'hex')

    console.log(req.body.to);
    console.log(req.body.from);
  function sendRaw(rawTx) {
    var privateKey = new Buffer.from(privateKey1Buffer, 'hex');
    
    var transaction = new Tx(rawTx, {'chain':'ropsten'});
    transaction.sign(privateKey);
    var serializedTx = transaction.serialize().toString('hex');
    web3js.eth.sendSignedTransaction(
        '0x' + serializedTx, function(err, result) {
            if(err) {
                console.log('error');
                console.log(err);
            } else {
                console.log('success');
                console.log(result);
            }
        });
}
console.log("transactions:" +web3js.eth.getTransactionCount(req.body.to));
var rawTx = {
  nonce: web3js.utils.toHex(web3js.eth.getTransactionCount(req.body.to)),
  gasPrice: 0x9184e72a000,
  gasLimit: web3.utils.toHex(21000),
  to: req.body.to,
  from: req.body.from,
  value: req.body.value

}
sendRaw(rawTx);
console.log(rawTx);


  //const tx = new Tx(req.body, { 'chain': 'ropsten' });
  //tx.sign("0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318");
  //var serializedTx = '0x' + tx.serialize().toString('hex');


  //signed = web3js.eth.account.sign_transaction(req.body, key)
  //signed = web3js.eth.getTransactionCount(req.body.from);
  //const tx = new Tx(req.body, { 'chain': 'ropsten' });
  //tx.sign(privateKey1Buffer);
 // const serializedTx = tx.serialize().toString('hex')
  //web3js.eth.sendSignedTransaction('0x' + serializedTx)
  //signed.rawTransaction
  //web3js.eth.sendRawTransaction(signed.rawTransaction) 
 // web3js.eth.sendTransaction(serializedTx)
  //await transfer(req.body.to, req.body.value).send({ from: req.body.from });
 // var web4 = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/b05dc62351984a3e95cfc176400805aa"));


  // get the number of transactions sent so far so we can create a fresh nonce
 //var contract =  web4.eth.contract(VaultCoinArtifact.abi).at(deployedNetwork.address);

//   web3js.eth.getTransactionCount(req.body.from).then(txCount => {
//     var txData = {
      

//       nonce: web3.utils.toHex(txCount),
      
//       gasLimit: web3.utils.toHex(25000),
      
//       gasPrice: web3.utils.toHex(web3js.eth.gasPrice),
      
//       to: req.body.to,
      
//       from: req.body.from,

//       value: 0,
      
//       data: contract.transfer.getData(req.body.to, req.body.values),
//       chainId: 0x03      
//       }

    //const newNonce = web3.utils.toHex(txCount)
  // const transaction = new Tx(txData, { 'chain': 'ropsten' });
  //   transaction.sign(privateKey1Buffer)
  //   const serializedTx = transaction.serialize().toString('hex')
  //   console.log(serializedTx )
  //   console.log("testttt" )
  //   web3js.eth.sendSignedTransaction('0x' + serializedTx)
  // });
  
  const balance = await balanceOf(req.body.to).call();
  
  res.status(200).send(JSON.stringify(
      {
        balance:balance
      }
    )
  )

}

const getTransactionHistory = async (req,res,next) => {
  web3js = new web3(new web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/b05dc62351984a3e95cfc176400805aa"
  ));
  var meta=null;
  const networkId = await web3js.eth.net.getId();
  const deployedNetwork = VaultCoinArtifact.networks[networkId];
  
  meta = new web3js.eth.Contract(
      VaultCoinArtifact.abi,
      deployedNetwork.address,
  );

  meta.getPastEvents("allEvents",{
    fromBlock: 0,
    toBlock: 'latest'
  }).then(function(events){
    var transactions=[];
    let account = req.body.account;
    for (let i = 0; i < events.length; i++) {
      if (( account == events[i].returnValues.from) || (account == events[i].returnValues.to)) {

        const amount = parseInt(events[i].returnValues.tokens);
        const convertedAmount = amount/1000000000000000000;
        
        transactions.push({
          from:events[i].returnValues.from,
          to:events[i].returnValues.to,
          tokens:convertedAmount.toString(),
        });
      }
    }

    res.json(transactions.reverse())
    
  })
}

const generateSeedPhrase = async (req,res,next) => {
  const privatekey = "fccb754e0c21369a75caa3ae9432e9b6cb734619eb3151ede06a54b9de49a894"; 
  const commmand = 'echo -n "'+privatekey+'" | ./bx-linux-x64-qrcode base16-encode | ./bx-linux-x64-qrcode sha256 | cut -c 1-32 | ./bx-linux-x64-qrcode  mnemonic-new';
  exec(commmand, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error`);
      return;
    }

    res.json(stdout);
  });
}

const importAccount = async (req,res,next) => {
  web3js = new web3(new web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/b05dc62351984a3e95cfc176400805aa"
  ));
  const privateKey = req.body.privatekey;

  const account = await web3js.eth.accounts.privateKeyToAccount(privateKey);

  console.log("result :");
  console.log(account);
  res.json({
    account:account['address']
  });
}

const createAccount = async (req,res,next) => {
  console.log("inside create account")
  /*res.json({
    privatekey:"dc999166e40dfde0fe68d2c3e81b1bb11f12f89778f58ed31fd943447c8f8ab6",
    account:"0xEeA09a32C4a4986E198F76493A177aa2e0D67092"
  });*/

  web3js = new web3(new web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/b05dc62351984a3e95cfc176400805aa"
  ));

  const account = await web3js.eth.accounts.create();

  res.json({
    privatekey:account['privateKey'],
    account:account['address']
  });
  
}

const getBalanceInEth = async (req,res,next) => {
  web3js = new web3(new web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/b05dc62351984a3e95cfc176400805aa"
  ));

  const publicKey = req.body.account;
  web3js.eth.getBalance(publicKey, function(err, result) {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send(JSON.stringify(
        {
          balanceEth:web3.utils.fromWei(result, "ether"),
          balanceEthWei:result,
        }
      ))
    }
  })
}


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send(JSON.stringify({msg:"no token in headers"}))
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send(JSON.stringify({msg:"erreur in token"}))
      req.user = user
      next()
    })
}




//route.get('/',authenticateToken,index)
route.post('/getBalance',getBalance)
route.post('/sendCoin',sendCoin)
route.post('/history',getTransactionHistory)

route.post('/generateSeedPhrase',generateSeedPhrase)
route.post('/importAccount',importAccount)
route.post('/getBalanceInEth',getBalanceInEth)
route.post('/createAccount',createAccount)


module.exports = route;