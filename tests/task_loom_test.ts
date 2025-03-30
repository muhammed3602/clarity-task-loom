import {
    Clarinet,
    Tx,
    Chain,
    Account,
    types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test task creation and retrieval",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        // Create a task
        let block = chain.mineBlock([
            Tx.contractCall('task-loom', 'create-task', [
                types.ascii("Test Task"),
                types.ascii("Test Description"),
                types.uint(1677628800),
                types.principal(user1.address)
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectUint(1);
        
        // Get task details
        let response = chain.callReadOnlyFn(
            'task-loom',
            'get-task',
            [types.uint(1)],
            deployer.address
        );
        
        let task = response.result.expectOk().expectTuple();
        assertEquals(task.title, "Test Task");
        assertEquals(task.completed, false);
    }
});

Clarinet.test({
    name: "Test task completion",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        // Create and complete task
        let block = chain.mineBlock([
            Tx.contractCall('task-loom', 'create-task', [
                types.ascii("Test Task"),
                types.ascii("Test Description"),
                types.uint(1677628800),
                types.principal(user1.address)
            ], deployer.address),
            Tx.contractCall('task-loom', 'complete-task', [
                types.uint(1)
            ], user1.address)
        ]);
        
        assertEquals(block.receipts.length, 2);
        block.receipts[1].result.expectOk().expectBool(true);
        
        // Verify completion
        let response = chain.callReadOnlyFn(
            'task-loom',
            'get-task',
            [types.uint(1)],
            deployer.address
        );
        
        let task = response.result.expectOk().expectTuple();
        assertEquals(task.completed, true);
    }
});

Clarinet.test({
    name: "Test task reassignment",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        const user2 = accounts.get('wallet_2')!;
        
        // Create and reassign task
        let block = chain.mineBlock([
            Tx.contractCall('task-loom', 'create-task', [
                types.ascii("Test Task"),
                types.ascii("Test Description"),
                types.uint(1677628800),
                types.principal(user1.address)
            ], deployer.address),
            Tx.contractCall('task-loom', 'reassign-task', [
                types.uint(1),
                types.principal(user2.address)
            ], deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 2);
        block.receipts[1].result.expectOk().expectBool(true);
        
        // Verify reassignment
        let response = chain.callReadOnlyFn(
            'task-loom',
            'get-task',
            [types.uint(1)],
            deployer.address
        );
        
        let task = response.result.expectOk().expectTuple();
        assertEquals(task.assignee, user2.address);
    }
});
