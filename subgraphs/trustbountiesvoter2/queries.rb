{
  users(first: 5) {
    id
  }
  collections(first: 5) {
    id
    owner
    active
    badgeId
    minBounty
    tradingFee
    tokenMinter
    totalTrades
    referrerFee
    totalVolumeBNB
    recurringBounty
    whitelistChecker
    numberTokensListed
    numberPaywallsListed
    numberPartnerTokensListed
    numberPartnerPaywallsListed
    registrations {
      user {
        id
      }
    }
    items {
      id
      active
      tokenId
      currentAskPrice
      currentSeller
      lastBidder
      metadataUrl
      updatedAt
      maxSupply
      totalTrades
      dropinTimer
      transferrable
      rsrcTokenId
      priceReductor {
        id
        cashbackStatus
        discountStatus
        cashbackStart
        discountStart
        cashbackNumbers
        discountNumbers
        cashbackCost
        discountCost
        cashNotCredit
        checkIdentityCode
      }
      identityProof {
        id
        requiredIndentity
        valueName
        uniqueAccounts
        onlyTrustWorthyAuditors
        minIDBadgeColor
      }
    }
    paywalls {
      id
      active
      tokenId
      currentSeller
      currentAskPrice
      lastBidder
      metadataUrl
      updatedAt
      maxSupply
      totalTrades
      dropinTimer
      transferrable
      rsrcTokenId
      priceReductor {
        id
        cashbackStatus
        discountStatus
        cashbackStart
        discountStart
        cashbackNumbers
        discountNumbers
        cashbackCost
        discountCost
        cashNotCredit
        checkIdentityCode
      }
      identityProof {
        id
        requiredIndentity
        valueName
        uniqueAccounts
        onlyTrustWorthyAuditors
        minIDBadgeColor
      }
    }
    partnerItems {
      id
      active
      tokenId
      currentSeller
      currentAskPrice
      lastBidder
      metadataUrl
      updatedAt
      maxSupply
      totalTrades
      dropinTimer
      transferrable
      rsrcTokenId
    }
    partnerPaywalls {
      id
      active
      tokenId
      currentSeller
      currentAskPrice
      lastBidder
      metadataUrl
      updatedAt
      maxSupply
      totalTrades
      dropinTimer
      transferrable
      rsrcTokenId
    }
    dayData {
      id
      date
      dailyTrades
    }
  }
  nfts(first: 5) {
    id
    tokenId
    currentSeller
    lastBidder
    ve
    tFIAT
    usetFIAT
    direction
    superLikes
    superDisLikes
    collectionPartners {
      id
    }
  }
}