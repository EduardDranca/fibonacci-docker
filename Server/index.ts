import keys from './keys';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as redis from 'redis';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
   user: keys.pgUser,
   host: keys.pgHost,
   database: keys.pgDatabase,
   password: keys.pgPassword,
   port: parseInt(keys.pgPort)
});

pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error(err));
});

const redisClient = redis.createClient({
    url: `redis://${keys.redisUrl}`
});
const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
    console.log(keys.redisUrl);
    console.log('Hi');
    res.send('Hi!');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');

    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    const values = await redisClient.hGetAll('values');

    res.send(values);   
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    console.log(index);
    const result = await pgClient.query('SELECT * FROM values WHERE number=$1', [index]);
    if (result.rowCount === 0) {
        redisClient.hSet('values', index, 'Nothing yet!');
        redisPublisher.publish('insert', index);
        pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
    }

    res.send({working: true});
});

app.listen(5000, async () => {
    await redisClient.connect();
    await redisPublisher.connect();
});