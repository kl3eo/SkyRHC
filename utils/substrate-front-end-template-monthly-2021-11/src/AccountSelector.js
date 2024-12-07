import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  Menu,
  Button,
  Dropdown,
  Container,
  Icon,
  Label
} from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function sender () {
  const message = { action: 'saveCookie' };
  window.parent.postMessage(JSON.stringify(message), '*');
}

function sender2 () {
  const message = { action: 'openWallet' };
  window.parent.postMessage(JSON.stringify(message), '*');
}

function Main (props) {
  // const { keyring } = useSubstrate();
  const { setAccountAddress } = props;
  const { myAcc } = props;
  const [accountSelected, setAccountSelected] = useState('');

  // Get the list of accounts we possess the private key fori
  /*
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user'
  }));
  //
  const keyringOptions = [{
    key: myAcc,
    value: myAcc,
    text: 'My Account',
    icon: 'user'
  }];
  */

  const initialAddress = myAcc;
  let keyringOptions = [{
    key: myAcc,
    value: myAcc,
    text: 'My account',
    icon: 'user'
  }];
  if (!myAcc.length) keyringOptions = [];

  // keyringOptions.length > 0 ? keyringOptions[0].value : '';

  // Set the initial address
  useEffect(() => {
    setAccountAddress(initialAddress);
    setAccountSelected(initialAddress);
  }, [setAccountAddress, initialAddress]);
  const onChange = address => {
    // Update state with new account address
    setAccountAddress(address);
    setAccountSelected(address);
  };

  return (
    <Menu
      attached='top'
      tabular
      style={{
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        paddingTop: '1em',
        paddingBottom: '1em'
      }}
    >
      <Container>
        <Menu.Menu position='right' style={{ alignItems: 'center' }}>
          { !accountSelected
            ? <span style={{ marginRight: '3px', marginLeft: '10px' }}>
              <button style={{ paddingLeft: '2px', paddingRight: '2px', minWidth: '84px', cursor: 'pointer' }} onClick={sender}>BUY TICKET</button>
            </span>
            : null }
          <CopyToClipboard text={accountSelected}>
            <Button
              basic
              circular
              size='large'
              icon='user'
              color={accountSelected ? 'grey' : 'red'}
            />
          </CopyToClipboard>
          <Dropdown
            style={{ backgroundColor: 'transparent', color: '#aaa', border: '1px solid grey', marginRight: '2px' }}
            search
            selection
            clearable
            placeholder='Select an account'
            options={keyringOptions}
            onChange={(_, dropdown) => {
              onChange(dropdown.value);
            }}
            value={accountSelected}
          />
          <BalanceAnnotation accountSelected={accountSelected} />
        </Menu.Menu>
      </Container>
    </Menu>
  );
}

function BalanceAnnotation (props) {
  const { accountSelected } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState('..checking');

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;

    // If the user has selected an address, create a new subscription

    async function fetchData () {
      /*
      accountSelected && api.query && api.query.system &&
          api.query.system.account(accountSelected, balance => {
            setAccountBalance(balance.data.free.toHuman());
          }).then(unsub => {
            unsubscribe = unsub;
          }).catch(console.error);
      */
      accountSelected && fetch(api + '?acc=' + accountSelected)
        .then(response => response.json())
        .then(json => { const a = Math.round((json.current_balance + Number.EPSILON) * 1000000) / 1000; setAccountBalance(a + ' RHC'); });
    }
    fetchData();

    return () => unsubscribe && unsubscribe();
  }, [api, accountSelected]);
  return accountSelected
    ? <Label onClick={sender2} style={{ cursor: 'pointer', backgroundColor: '#333', color: '#fff', border: '1px solid #333' }} pointing='left'>
        <Icon name='money' color='green' />
        {accountBalance}
      </Label>
    : null;
}

export default function AccountSelector (props) {
//  const { api, keyring } = useSubstrate();
//  return keyring.getPairs && api.query ? <Main {...props} /> : null;
  const { api } = useSubstrate();

  // return api.query ? <Main {...props} /> : null;
  return api.length ? <Main {...props} /> : null;
}
