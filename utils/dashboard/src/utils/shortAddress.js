const shortAddress = (address, begin, end) => {
    begin = begin ? begin : 6;
    end = end ? end : -6;
    if (address) {
        return `${address.slice(0, begin)}...${address.slice(end)}`;
    }
    return '';
};
export default shortAddress;
//# sourceMappingURL=shortAddress.js.map