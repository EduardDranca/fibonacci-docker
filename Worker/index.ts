import * as redis from 'redis';
import keys from './keys';

const redisClient = redis.createClient({
    url: `redis://${keys.redisUrl}`
});

function fib(index: number): number {
    if (index < 2) {
        return 1;
    }
    return fib(index - 2) + fib(index - 1);
}
(async () => {
    await redisClient.connect();
    const sub = redisClient.duplicate();
    await sub.connect();
    sub.subscribe('insert', async (message, channel) => {
        redisClient.hSet('values', message, fib(parseInt(message)));
    });
})();

