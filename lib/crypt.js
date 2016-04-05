import crypto from 'crypto';

export function md5(s) {
    var h = crypto.createHash('md5');
    h.write(s || '');
    return h.digest('hex');
}

export function password(s) {
    return md5(s);
}