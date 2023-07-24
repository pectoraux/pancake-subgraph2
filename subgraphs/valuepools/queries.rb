{
  valuepools(first: 5) {
    id
    ve
    name
    active
    riskpool
    cities
    products
    countries
    timestamp
    description
    onePersonOneVote
  }
  transactions(first: 5) {
    id
    block
    timestamp
    tokenId
    vaAddress
    user
    netPrice
    depositType
    rank
    locktime
    txType
    valuepool {
      id
    }
  }
}