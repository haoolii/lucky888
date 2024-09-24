import { RequestError } from "./core/error";
import { delay } from "./core/utils";

const main = async () => {
    try {
        await delay(1000);
        throw new RequestError('test');
    } catch (err) {
        if (err instanceof RequestError){
            console.log('Hi');
        }
    }
};
main();
