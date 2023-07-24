{
  accounts {
    id
    channel
    owner
    timestamp
    active
  }
  ramps(first: 5) {
    id
    owner
    collectionId
    description
    rampAddress
    publishableKeys
    applicationLink,
    secretKeys
    clientIds
    avatar
    profileId
    likes
    dislikes
    sessions {
      id
      user
      active
      amount
      sessionId
      tokenAddress
      identityTokenId
    }
    tokens {
      id
      addedToTokenSet
    }
    transactionHistory {
      id
      user
      block
      token
      txType
      netPrice
      timestamp
    }
  }
  transactions(first: 5) {
    id
    block
    timestamp
    token
  }
}