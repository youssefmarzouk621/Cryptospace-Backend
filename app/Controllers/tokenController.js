require('dotenv').config()

const express = require('express');

const jwt = require('jsonwebtoken')
const { exec } = require('child_process');

const route = express.Router();

const web3 = require('web3');
const VaultCoinArtifact = require('../../build/contracts/VaultCoin.json');

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

  await transfer(req.body.receiver, req.body.amount).send({ from: req.body.account });
  
  const balance = await balanceOf(req.body.receiver).call();
  
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

    res.json(transactions)
    
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