import React, { useState, createRef } from 'react';
import { Dimmer, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import AccountSelector from './AccountSelector';
// import './App.css';
import queryString from 'query-string';

function sender (acc) {
  const mess = { action: acc };
  window.parent.postMessage(JSON.stringify(mess), '*');
}

// useful stuff
/*
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

async function timeSensativeAction () {
  await sleep(2000);
}
*/

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, apiError } = useSubstrate();
  // const myAcc = '5EHgdxZC3BhoYANeHhAVZWKrxfF23pcZrDfBwpDVTuLrCHB4';
  const parsedQuery = queryString.parse(window.location.search);
  const myAcc = parsedQuery.acc.length ? parsedQuery.acc : '';

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to SkyRHC'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') { sender('err'); return message(apiError); } else if (apiState !== 'READY') { sender('load'); return loader('Connecting to SkyRHC'); }
  if (apiState !== 'ERROR' && apiState === false) {
    console.log(accountAddress);
  }

  if (apiState === 'READY') { sender('success'); }

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector setAccountAddress={setAccountAddress} myAcc={myAcc} />
      </Sticky>
    </div>
  );
}

export default function App () {
  return (
    <SubstrateContextProvider>
      <Main style={{ backgroundColor: 'transparent' }} />
    </SubstrateContextProvider>
  );
}
