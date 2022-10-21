module.exports = {
  helpers: {

    eq: function (V1, V2) { return V1 === V2; },
    gt: function (V1, V2) { return V1 > V2 },
    ne: (v1, v2) => {
      return v1 !== v2;
    },
    lt: (v1, v2) => {
      return v1 < v2;
    },
    add: (v1, v2) => {
      return v1 + v2
    },
    lte: (v1, v2) => {
      return v1 <= v2;
    },
    gte: (v1, v2) => {
      return v1 >= v2;
    },
    and: (v1, v2) => {
      return v1 && v2;
    },
    or: (v1, v2) => {
      return v1 || v2;
    },
    format: function (data) {
      newdata = data.toUTCString()
      return newdata.slice(0, 16)
    },
    subTotal: function (price, quantity) {
      return price * quantity
    },
    ifEquals: function (arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    twoConditions: function (one1, one2, two1, two2, options) {
      return (one1 == one2 || two1 == two2) ? options.fn(this) : options.inverse(this)
    },
    threeConditions: function (one1, one2, two1, two2, three1, three2, options) {
      return (one1 == one2 || two1 == two2 || three1 == three2) ? options.fn(this) : options.inverse(this)
    },
  }
}