
const urlBuilderBlockNumber = (value: string, chain: string, provider: string): any => {
  if (provider === 'subscan' && chain !== 'skypirl') {
    return `https://${chain}.${provider}.io/block/${value}`
  }

  if (provider === 'subscan' && chain === 'skypirl' && typeof(value) !== 'undefined') {
    value = value.split(',').join('')
    return `https://${provider}.${chain}.org/skypirl4/block/${value}`
  }
  
  if (provider === 'polkascan') {
    return `https://${provider}.io/pre/${chain}/block/${value}`
  }  
}

const urlBuilderAccount = (value: string, chain: string, provider: string): any => {
  if (provider === 'subscan' && chain !== 'skypirl') {
    return `https://${chain}.${provider}.io/account/${value}`
  }

  if (provider === 'subscan' && chain === 'skypirl' && typeof(value) !== 'undefined') {
    value = value.split(',').join('')
    return `https://${provider}.${chain}.org/skypirl4/account/${value}`
  }
  
  if (provider === 'polkascan') {
    return `https://${provider}.io/pre/${chain}/account/${value}`
  }  
}

const urlBuilderTransaction = (value: string, chain: string, provider: string): any => {
  if (provider === 'subscan' && chain !== 'skypirl') {
    return `https://${chain}.${provider}.io/extrinsic/${value}`
  }

  if (provider === 'subscan' && chain === 'skypirl' && typeof(value) !== 'undefined') {
    value = value.split(',').join('')
    return `https://${provider}.${chain}.org/skypirl4/extrinsic/${value}`
  }
  
  if (provider === 'polkascan') {
    return `https://${provider}.io/pre/${chain}/transaction/${value}`
  }
}

export { urlBuilderAccount, urlBuilderBlockNumber, urlBuilderTransaction }
