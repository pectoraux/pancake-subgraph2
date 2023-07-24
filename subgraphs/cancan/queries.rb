{
  collections(first: 5) {
    id
    name
    large
    small
    avatar
    owner
    active
    badgeId
    minBounty
    tradingFee
    totalTrades
    referrerFee
    totalVolumeBNB
    description
    contactChannels
    contacts
    workspaces
    countries
    cities
    products
    recurringBounty
    numberTokensListed
    numberPaywallsListed
    numberPartnerTokensListed
    numberPartnerPaywallsListed
    requestUserRegistration
    requestPartnerRegistration
    registrations {
      id
      active
      timestamp
      bountyId
      userCollection {
        id
        name
        small
        avatar
        totalVolumeBNB
      }
    }
    partnerRegistrations {
      id
      active
      timestamp
      bountyId
      partnerCollection {
        id
      }
      items {
        id
      }
    }
    items {
      id
      ve
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
      option_mins
      option_maxs
      option_unitPrices
      option_elements
      option_categories
      option_traitTypes
      option_values
      option_currencies
      countries
      cities
      products
      collection {
        tradingFee
      }
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
    dayData {
      id
      date
      dailyTrades
    }
  }
  contacts(first: 5) {
    id
    collection {
      id
    }
    channel
    value
  }
}