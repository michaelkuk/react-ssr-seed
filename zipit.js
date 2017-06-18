const { createReadStream, createWriteStream } = require('fs');
const { createGzip } = require('zlib');
const { join } = require('path');

const source = createReadStream(join(__dirname, 'build', 'public', 'app_3955ad739a08d2e3dcfd.js'));

const dest = createWriteStream(join(__dirname, 'zipped.js.gz'));

const zipper = createGzip();

source.pipe(zipper).pipe(dest);
