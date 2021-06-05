class TransactionChecker {
    constructor(address) {
        this.address = address.toLowerCase();
        this.web3 = new Web3("http://127.0.0.1:7545");
    }
  
    async checkBlock() {
      let block = await this.web3.eth.getBlock('latest');
      let number = block.number;
      let transactions = block.transactions;
      //console.log('Search Block: ' + transactions);
  
      if (block != null && block.transactions != null) {
            for (let txHash of block.transactions) {
                let tx = await this.web3.eth.getTransaction(txHash);
                if (this.address == tx.to.toLowerCase()) {
                    console.log("from: " + tx.from.toLowerCase() + " to: " + tx.to.toLowerCase() + " value: " + tx.value);
                }
            }
        }
    }
}
  