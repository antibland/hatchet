const utilities = {
  truncate: (str, len=75) => (str.length > len) ? str.substr(0, len-1) + '…' : str
};

export default utilities;
