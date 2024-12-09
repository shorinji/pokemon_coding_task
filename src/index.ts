
import Server from './Server'

require('dotenv').config();

const  port = parseInt(process.env.PORT as string) || 3000;
const node_env = process.env.NODE_ENV || 'development';

const server = new Server(port, node_env);
server.start();