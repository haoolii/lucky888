import db from "../db";
import { CreateUserParams } from "./user.types";

/**
 * User Service
 * TODO: 各種例外狀況實作
 */
class UserService {

    constructor() {}
    
    async createUser(params: CreateUserParams) {
        try {
            await db.user.create({
                data: {
                    id: params.id,
                    balance: 0,
                    lockedBalance: 0
                }
            })
        } catch (err) {
            return {
                msg: 'Create User Failed'
            }
        }
    }

    async getUserBalance(id: string) {
        try {
            const user = await db.user.findUnique({
                where: {
                    id
                }
            });

            if (!user) {
                return {
                    msg: 'Not Found User'
                }
            }

            return {
                balance: user?.balance,
                lockedBalance: user?.lockedBalance,
            }
        } catch (err) {
            return {
                msg: 'Get User Balance Failed'
            }
        }
    }

    /**
     * 新增下注紀錄
     */
    async CreateBetRecord() {}
}

export default UserService;