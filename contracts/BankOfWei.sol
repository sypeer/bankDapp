pragma solidity >=0.4.21 <0.6.0;

contract BankOfWei {

  // State Variables
  uint public customerId;
  mapping (address => Customer) transactionAccounts;

  // Structs
  struct Customer {
    uint customerId;
    address payable customer;
    uint balance;
    bool registered;
  }

  // Events
    event RegisteredLog(address customer);
    event DepositLog(address customer, uint amount, uint remainingBalance);
    event WithdrawalLog(address customer, uint amount, uint remainingBalance);
    event TransferLog(address customer, uint amount, address receiver, uint remainingBalance);

  constructor() public {
    customerId = 0;
  }

  // Fallback Function
  function() external payable {
    revert();
  }

  // Register Cutomer
  function register() public payable returns(bool) {
    Customer memory customer = Customer(customerId, msg.sender, 0, true);
    transactionAccounts[msg.sender] = customer;
    customerId += 1;
    emit RegisteredLog(customer.customer);
    return(true);
  }

  function checkRegistration(address _customer) public view returns(bool) {
    Customer memory customer = transactionAccounts[_customer];
    return(customer.registered);
  }

  // Get customer details
  function returnCustomer() public view returns(uint, address, uint) {
    Customer memory customer = transactionAccounts[msg.sender];
    return(customer.customerId, customer.customer, customer.balance);
  }

  // Get Customer Balance
  function getBalance() public view returns(uint) {
    Customer memory customer = transactionAccounts[msg.sender];
    require(customer.registered);
    require(customer.customer == msg.sender);
    return(customer.balance);
  }

  // Deposit Funds
  function depositWei(uint _amount) public payable returns(uint) {
    Customer memory customer = transactionAccounts[msg.sender];
    require(customer.registered);
    customer.balance += _amount;
    transactionAccounts[msg.sender] = customer;
    emit DepositLog(customer.customer, _amount, customer.balance);
    return(customer.balance);
  }

  // Withdraw Funds
  function withdrawWei(uint _amount) public payable returns(uint) {
    Customer memory customer = transactionAccounts[msg.sender];
    require(customer.registered);
    require(_amount <= customer.balance);
    msg.sender.transfer(_amount);
    customer.balance -= _amount;
    transactionAccounts[msg.sender] = customer;
    emit WithdrawalLog(customer.customer, _amount, customer.balance);
    return(customer.balance);
  }

  // Transfer Funds
  function transferWei(address payable _to, uint _amount) public payable returns(bool) {
    Customer memory customer = transactionAccounts[msg.sender];
    Customer memory receiver = transactionAccounts[_to];
    require(customer.registered);
    require(receiver.registered);
    customer.balance -= _amount;
    receiver.balance += _amount;
    transactionAccounts[msg.sender] = customer;
    transactionAccounts[_to] = receiver;
    emit TransferLog(customer.customer, _amount, receiver.customer, customer.balance);
    return(true);
  }

}
