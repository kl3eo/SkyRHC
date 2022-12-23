  
//old unreliable, no error check

  public async shipIt(): Promise<void> {
    const { api } = Connector.getInstance();
      try {
        showNotification('Dispatched');
	const pirl = 5000000000000; //5Pirl

        let getVars:string = '';
        let uri = window.location.href.split('?');
        if(uri.length == 2) {
          let vars = uri[1].split('#');
          vars.forEach(function(v) {
            let tmp = v.split('=');
            if(tmp.length == 2)
              getVars = tmp[1];
          });
        }

	let accountToConst:string = '';
        let h = this.getParentOrigin(); 
	let reh=/https:\/\//gi;let hh = h.replace(reh,"");
	let hhh = hh.split('.');
	switch(hhh[0]) { 	
		case 'club' : accountToConst = '5ENzTTUL3zvnMP8usRo3ZcGmMhkaHsvFUP6PMedLV9EWtLFx';
			break; 
		case 'milan' : accountToConst = '5Dz8Ew8bsrd9BHCygQSBdqnBwiKGUMk86HVmrQhpXpUSDXKT';
			break; 	
		default: console.error('Unrecognized room name', hhh[0]);
	}
	const tx = await exec(this.accountFrom.address, this.password, api.tx.balances.transfer, [accountToConst, pirl?.toString()]);
console.log('tx:', tx);
        this.sender(this.accountFrom, accountToConst, pirl?.toString());
// update db
	let checker_port = '8453';
        let formData = new FormData();
        formData.append('sess', getVars);
        formData.append('pass', 'lol');
        formData.append('acc_id', this.accountFrom.address);
        fetch(h + ':' + checker_port + '/cgi/genc/tester.pl', {body: formData, method: 'post', mode: 'no-cors'}).then(
                function(response) {
	/*
			if (response.status !== 200) {
                                console.log('Looks like there was a problem. Status Code: ' + response.status);
                                return;
                        }
                                console.log(response);		
        */

	}).catch(function(err) {console.log('Fetch Error', err);});
//
	showNotification(tx, this.snackbarTypes.success);
      } catch (e) {
        console.error('[ERR: TRANSFER SUBMIT]', e)
        showNotification(e.message, this.snackbarTypes.danger);
      }
  }
