// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

contract TodoContract {
    struct Todo {
        uint256 id;
        address author;
        string message;
        uint256 timestamp;
    }

    event NewTodo(
        uint256 todoID,
        address indexed from,
        string message,
        uint256 timestamp
    );

    event SendMoneyToContract(
        uint256 todoID,
        address receiver,
        string message,
        uint256 timestamp
    );

    uint256 public todoID;
    Todo[] public todoList;
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "\u5fc5\u987b\u662f\u5408\u7ea6\u6240\u6709\u8005"
        );
        _;
    }

    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTodoList() public view returns (Todo[] memory) {
        return todoList;
    }

    // 函数：published，用于发布新的待办事项
    function published(string memory _message) public payable {
        todoID += 1;
        Todo memory item = Todo(todoID, msg.sender, _message, block.timestamp);
        todoList.push(item);
        emit NewTodo(todoID, msg.sender, _message, block.timestamp);

        uint256 payAmount = 0.1 ether;
        require(msg.value >= payAmount, "\u4f59\u989d\u4e0d\u8db3");
        (bool success, ) = payable(address(this)).call{value: payAmount}("");
        require(success, "\u5411\u5408\u7ea6\u6c47\u6b3e\u5931\u8d25");
        emit SendMoneyToContract(todoID, msg.sender, _message, block.timestamp);
    }

    // 函数：receive，用于接收以太币
    receive() external payable {}
}
