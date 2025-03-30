# TaskLoom
A minimalist task manager app designed for creative professionals to organize their workflow on the Stacks blockchain.

## Features
- Create and manage tasks with title, description, and deadline
- Mark tasks as complete/incomplete
- Assign tasks to specific users
- Track task history and updates
- View tasks by status or assignee

## Setup and Installation
1. Clone the repository
2. Install Clarinet (if not already installed)
3. Run `clarinet check` to verify the contract
4. Run `clarinet test` to run the test suite

## Usage Examples
```clarity
;; Create a new task
(contract-call? .task-loom create-task "Design Homepage" "Create wireframes and mockups" u1677628800 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

;; Mark task as complete
(contract-call? .task-loom complete-task u1)

;; Get task details
(contract-call? .task-loom get-task u1)

;; Get tasks by assignee
(contract-call? .task-loom get-tasks-by-assignee 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
```

## Dependencies
- Clarity language
- Clarinet for testing and deployment
