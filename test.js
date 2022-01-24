const { ecdsaSign } = require("secp256k1");
const ethUtil = require('ethereumjs-util');

const res = ecdsaSign(
    ethUtil.toBuffer("0xc3e672c49f0aa275c231b18e17590d14f8f5525f553b545f437ecb540f44c4ea"),
    ethUtil.toBuffer("0x32ba9c81659b6f4e188da8f43e70d51fb84d4e9cc6790d62d4e7855ad155c89b"),
);

console.log(ethUtil.bufferToHex(res.signature));
