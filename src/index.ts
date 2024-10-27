import 'dotenv/config';

const module = process.argv[3];

module === "cluster" ? import('./servers/cluster') : import('./servers/main');

