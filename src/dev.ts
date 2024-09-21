import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

async function checkBalance(tx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, userId: string, amount: number) {
    const user = await tx.userDev.findUnique({
        where: { id: userId },
        select: { balance: true },
    });

    if (!user || Number(user.balance) < amount) {
        throw new Error('Insufficient balance');
    }

    return user.balance;
}

async function minusBalance (tx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, userId: string, amount: number) {
    await tx.userDev.update({
        where: {
            id: userId
        },
        data: {
            balance: {
                decrement: amount
            }
        }
    })
}

async function placeOrder(tx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, userDevId: string, amount: number) {
    const order = await tx.userTransactionDev.create({
        data: {
            userDevId,
            amount,
            type: "PLACE"
        },
    });
    return order;
}

async function placeOrderWithCheck(userId: string, amount: number) {
    await prisma.$transaction(async (tx) => {
        // 1. 檢查餘額
        await checkBalance(tx, userId, amount);
    
        // 2. 扣除餘額
        await minusBalance(tx, userId, amount);
    
        // 3. 創建訂單
        const order = await placeOrder(tx, userId, amount);
        
        return order;
    });
}

async function simulateConcurrentOrder() {
    const userId = "user_1";
    const amount = 100;  // 假設訂單金額是 100

    try {
        // 使用 Promise.all 來模擬兩個併發的訂單請求
        await Promise.all([
            placeOrderWithCheck(userId, amount),
            placeOrderWithCheck(userId, amount),
            placeOrderWithCheck(userId, amount),
            placeOrderWithCheck(userId, amount),
            placeOrderWithCheck(userId, amount),
            placeOrderWithCheck(userId, amount),
        ]);
    } catch (error: any) {
        console.error("Error during order placement:", error.message);
    }
}

// 執行模擬併發
simulateConcurrentOrder().finally(async () => {
    await prisma.$disconnect();
});