First, run Swapper manually - fill the following form fields: 

1. dropdown your imported Substate account address
2. amount to swap
3. password for the account

Now push "Make Transfer" button and check for Errors. Possible errors are:

1. you forgot to fill 1,2,3 from above
2. your sum is bigger then allowed maximim for this swap
3. wrong password
4. RPC errors

If your manual swap is OK, in the end of the two TX you see a green "Sent...coins to addr TX ...".

Check this TX hash in the blockscout if you want. Check you've received the coins, indeed.

Now, to the bot business, Reload this page Ctrl+R.

Load the fields 1,2,3 with values again - but this time do not push "Make Transfer".

Instead, open the dev shell Ctrl+Shift+I.

Copy and paste this code:

const acca = document.getElementById('routerview').__vue__.accountFrom

var automate = function() {
  var i = 0;

  var intr = setInterval(function() {
    document.getElementById('routerview').__vue__.accountFrom = acca
    document.getElementById('routerview').__vue__.shipIt()
    if (++i == 300) clearInterval(intr);
  }, 81000)

}

Hit the Enter.

So far you defined the const "acca" to save the accountFrom data that you filled in 1.

Then you defined a function "automate()" which runs once in 81 sec and loops 300 times.

Now it's time to start the bot - type "automate()" and hit Enter. Wait for the first run in 81 sec. Your bot is running.
