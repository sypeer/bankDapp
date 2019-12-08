import Web3 from "web3";
import bankOfWeiArtifact from "../../build/contracts/BankOfWei.json";

var reader;

const App = {
  web3: null,
  account: null,
  instance: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = bankOfWeiArtifact.networks[networkId];
      this.instance = new web3.eth.Contract(
        bankOfWeiArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      console.log(this.account);

      this.renderPage(this.account);

      $('#register-customer').submit(function(event) {
        $('#msg').hide();
        App.instance.methods.register().send({from:App.account, gas:4700000});
        console.log(App.account);
        $('#msg').show();
        $('#msg').html('Registered, welcome!');
        event.preventDefault();
      });

      $('#deposit-funds').submit(function(event) {
        $('#msg').hide();
        var amount = $('#deposit-amount').val();

        App.instance.methods.depositWei(amount).send({from:App.account, gas:4700000});
        console.log(amount);

        $('#msg').show();
        $('#msg').html('Deposit submitted!');
        event.preventDefault();
      });

      $('#withdrawal-funds').submit(function(event) {
        $('#msg').hide();
        var amount = $('#withdrawal-amount').val();

        App.instance.methods.withdrawWei(amount).send({from:App.account, gas:4700000});
        console.log(amount);

        $('#msg').show();
        $('#msg').html('Withdrawal submitted!');
        event.preventDefault();
      });

      $('#tranfer-funds').submit(function(event) {
        $('#msg').hide();
        var amount = $('#tranfer-amount').val();
        var receiver = $('#transfer-receiver').val();

        App.instance.methods.transferWei(receiver, amount).send({from:App.account, gas:4700000});
        console.log(amount);

        $('#msg').show();
        $('#msg').html('Transfer submitted!');
        event.preventDefault();
      });

    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  renderPage: async function(account) {
    const { checkRegistration } = this.instance.methods;
    var registered = await checkRegistration(account).call();
    console.log(registered);
    if (registered === true) {
      $('#register-customer').hide();
      const { returnCustomer } = this.instance.methods;
      var customer = await returnCustomer().call();
      console.log(customer);
      $('#balance').html(displayPrice(customer[2]));
    } else {
      $('#balance').html('No balance, please register');
    }
  },

};

function displayPrice(amt) {
  return 'Ξ' + App.web3.utils.fromWei(amt.toString(), 'ether');
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
