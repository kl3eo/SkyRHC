import { getTypeDef } from '@polkadot/types';
const extractStorageParams = (key) => {
    const { creator: { meta: { type }, section } } = key;
    if (type.isDoubleMap) {
        return [
            { type: getTypeDef(type.asDoubleMap.key1.toString()) },
            { type: getTypeDef(type.asDoubleMap.key2.toString()) }
        ];
    }
    if (type.isMap) {
        return [{
                type: getTypeDef(type.asMap.linked.isTrue
                    ? `Option<${type.asMap.key.toString()}>`
                    : type.asMap.key.toString())
            }];
    }
    return [];
};
export default extractStorageParams;
//# sourceMappingURL=extractParams.js.map