const getTimestamp = (time) => {
    return (new Date(time).getTime()/1000)
};

module.exports.getTimestamp = getTimestamp;