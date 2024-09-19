import { PrismaClient } from '@prisma/client'

const prism = new PrismaClient();
const minusBalance = async (amount: number) => {
    // const prism = new PrismaClient();
    const user = await prism.userRace.findUnique({ where: { id: '1' }});

    if (!user) return;

    if (Number(user.balance) < amount) {
        console.log('Balance not enough');
        return;
    }
    console.log('Balance', user.balance);
    await prism.userRace.update({
        where: {
            id: '1'
        },
        data: {
            balance: Number(user.balance) - amount
        }
    });
}


const minusBalanceTx = async (amount: number) => {
    

    const result = await prism.$transaction(async (tx) => {
        const user = await tx.userRace.findUnique({ where: { id: '1' } });

        if (!user) return;

        if (Number(user.balance) < amount) {
            console.log('Balance not enough');
            return;
        }

        console.log('Balance', user.balance);

        return await tx.userRace.update({
            where: { id: '1' },
            data: { balance: Number(user.balance) - amount }
        });
    });

    return result;
};

const main = async () => {
    // 使用 Promise.all 來模擬高併發
    const startTime = Date.now()
    const amounts = [5, 4, 3, 2, 1, 5, 4, 3];
    await Promise.all(amounts.map(amount => minusBalance(amount)));
    const endTime = Date.now(); // 锁定结束时间
    console.log(`During time: ${endTime - startTime} ms`);


    const startTimetx = Date.now()
    const amountstx =[5, 4, 3, 2, 1, 5, 4, 3];
    await Promise.all(amountstx.map(amount => minusBalanceTx(amount)));
    const endTimetx = Date.now(); // 锁定结束时间
    console.log(`TX During time: ${endTimetx - startTimetx} ms`);

};

main()
    .catch(e => console.error(e))
    .finally(async () => {

    });