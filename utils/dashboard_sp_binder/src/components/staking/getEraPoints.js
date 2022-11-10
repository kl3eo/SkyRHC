import Connector from '@vue-polkadot/vue-api';
export const getEraPoints = async () => {
    const { api } = Connector.getInstance();
    const response = await api.derive.staking?.currentPoints();
    if (!response.individual) {
        return {};
    }
    return mapEraPoint(response.individual);
};
export const mapEraPoint = (eraPoints) => {
    const result = {};
    eraPoints.forEach((value, key) => {
        result[key.toString()] = value.toString();
    });
    return result;
};
//# sourceMappingURL=getEraPoints.js.map