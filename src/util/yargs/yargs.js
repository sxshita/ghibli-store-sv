import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).options({
    'port': {
        alias: 'p',
        description: 'port to bind on',
        default: 8080
    },
    'mode': {
        alias: 'mod',
        default: 'FORK'
    }
}).argv

export default argv;