// connect to Moralis server
const serverUrl = "https://00gmd4clt0ea.usemoralis.com:2053/server";
const appId = "2AZIcwP4NdRSnIJ1JcSLnED7QGTDEl0XOnAKIYG4";
Moralis.start({ serverUrl, appId });

Moralis.initPlugins().then(() => console.log('plugins have been initialized'));

const $tokenBalanceTBody = document.querySelector('.js-token-balances');
const $selectedToken = document.querySelector('.js-from-token');
const $amountInput = document.querySelector('.js-from-amount');

let finalToAddress = '';
let finalFromAddress = '';
let finalAmount = 0;

// converting from wei custom function
const tokenValue = (value, decimals) => (decimals ? value / Math.pow(10, decimals) : value);

// add from here down
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate();
  }
  console.log("logged in user:", user);

  getStats();
}

async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
}

async function buyCrypto() {
    Moralis.Plugins.fiat.buy();
}

document.getElementById("btn-buy-crypto").addEventListener('click', buyCrypto);
document.getElementById("btn-login").addEventListener('click', login);
document.getElementById("btn-logout").addEventListener('click', logOut);

/** Quote & Swap */

async function formSubmitted(event) {
    // quote request
    event.preventDefault();
    const fromAmount = Number.parseFloat($amountInput.value);
    const fromMaxValue = Number.parseFloat($selectedToken.dataset.max);
    console.log(fromAmount)
    if ( Number.isNaN(fromAmount) || fromAmount > fromMaxValue) {
        // invald input
        document.querySelector('.js-amount-error').innerHTML = 'Invalid Amount';
    } else {
        document.querySelector('.js-amount-error').innerHTML = '';
    }

    // swapping based on quote request
    const fromDecimals = $selectedToken.dataset.decimals;
    const fromAddress = $selectedToken.dataset.address;

    const [toAddress, toDecimals] = document.querySelector('[name=to-token]').value.split('-');

    try {
        const quote = await Moralis.Plugins.oneInch.quote({
            chain: 'polygon',
            fromTokenAddress: fromAddress,
            toTokenAddress: toAddress,
            amount: Moralis.Units.Token(fromAmount, fromDecimals).toString(),
        });
  
        const toAmount = tokenValue(quote.toTokenAmount, toDecimals);

        document.querySelector('.js-quote-container').innerHTML = `
        <p>
            ${fromAmount} ${quote.fromToken.symbol} = ${toAmount} ${quote.toToken.symbol}
        </p>
        <p>
            Gas Fee: ${quote.estimatedGas}
        </p>
        <button class="js-swap-button btn btn-primary btn-sm">Execute Swap</button>
        `;

        

        finalToAddress = toAddress;
        finalFromAddress = fromAddress;
        finalAmount = Moralis.Units.Token(fromAmount, fromDecimals).toString();

        document.querySelector('.js-swap-button').addEventListener('click', trySwap);

    } catch (e) {
        console.log(e);
        document.querySelector('.js-quote-container').innerHTML = `<p class="error">The conversion didn't succeed.</p>`;
    }
}

async function trySwap() {
    event.preventDefault();
    try {
        let allowance = await Moralis.Plugins.oneInch.hasAllowance({
            chain: 'polygon',
            fromTokenAddress: finalFromAddress,
            fromAddress: Moralis.User.current().get('ethAddress'),
            amount: finalAmount,
        });
        console.log(allowance);  
        if (!allowance) {
            await Moralis.Plugins.oneInch.approve({
                chain: 'polygon',
                tokenAddress: finalFromAddress,
                fromAddress: Moralis.User.current().get('ethAddress'),

            });
        }
        performSwap();
    } catch (e) {
        console.log(e);
        document.querySelector('.js-quote-container').innerHTML = `<p class="error">The transaction didn't succeed.</p>`;
    }
}

async function performSwap() {
    event.preventDefault();
    console.log(finalAmount);
    console.log(finalToAddress);
    console.log(finalFromAddress);
    console.log(Moralis.User.current().get('ethAddress'));
    try {
        let receipt = await Moralis.Plugins.oneInch.swap({
            chain: 'polygon',
            fromTokenAddress: finalFromAddress,
            toTokenAddress: finalToAddress,
            amount: finalAmount,
            fromAddress: Moralis.User.current().get('ethAddress'),
            slippage: 1
        });
        console.log(receipt);  
    } catch (e) {
        console.log(e);
        document.querySelector('.js-quote-container').innerHTML = `<p class="error">The transaction didn't succeed.</p>`;
    }
}

async function formCancelled(event) {
    event.preventDefault();
    document.querySelector('.js-submit').setAttribute('disabled', '');
    document.querySelector('.js-cancel').setAttribute('disabled', '');
    $amountInput.value = '';
    $amountInput.setAttribute('disabled', '');

    delete $selectedToken.dataset.address;
    delete $selectedToken.dataset.decimals;
    delete $selectedToken.dataset.max;

    document.querySelector('.js-quote-container').innerHTML = '';
    document.querySelector('.js-amount-error').innerHTML = '';
}

document.querySelector('.js-submit').addEventListener('click', formSubmitted);
document.querySelector('.js-cancel').addEventListener('click', formCancelled);

async function startSwap(event) {
    event.preventDefault();
    $selectedToken.innerHTML = event.target.dataset.symbol;
    $selectedToken.dataset.address = event.target.dataset.address;
    $selectedToken.dataset.decimals = event.target.dataset.decimals;
    $selectedToken.dataset.max = event.target.dataset.max;

    $amountInput.removeAttribute('disabled');
    $amountInput.value = '';

    document.querySelector('.js-submit').removeAttribute('disabled');
    document.querySelector('.js-cancel').removeAttribute('disabled');
    document.querySelector('.js-quote-container').innerHTML = '';
    document.querySelector('.js-amount-error').innerHTML = '';
}

async function getStats() {
    const balances = await Moralis.Web3API.account.getTokenBalances({chain: 'polygon'});
    console.log(balances);
    
    $tokenBalanceTBody.innerHTML = balances.map((token, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${token.symbol}</td>
            <td>${tokenValue(token.balance, token.decimals)}</td>
            <td>
                <button
                    class="js-swap btn btn-success btn-sm"
                    data-address="${token.token_address}"
                    data-symbol="${token.symbol}"
                    data-decimals="${token.decimals}"
                    data-max="${tokenValue(token.balance, token.decimals)}"
                >
                    Swap
                </button>
            </td>
        </tr>
    `).join('');

    for (let $btn of $tokenBalanceTBody.querySelectorAll('button')) {
        $btn.addEventListener('click', startSwap);
    }
}

async function getTopTokens() {
    try {
        let response = await fetch('https://api.coinpaprika.com/v1/coins');
        let tokens = await response.json();
        
        return tokens
            .filter(token => token.rank >= 1 && token.rank <= 50)
            .map(token => token.symbol);
    } catch(e) {
        console.log(`Error: ${e}`);
    }
}

async function getTopAddresses(tickerList) {
    try {
        let tokens = await Moralis.Plugins.oneInch.getSupportedTokens({ chain: 'polygon' });
        let tokenList = Object.values(tokens.tokens);
    
        console.log(tokenList.filter(token => tickerList.includes(token.symbol)));
        return tokenList.filter(token => tickerList.includes(token.symbol));
    } catch(e) {
        console.log(`Error: ${e}`);
    }
}

function renderDropDown(tokens) {
    const options = tokens.map(token => `<option value="${token.address}-${token.decimals}">${token.name}</option>`).join('');
    document.querySelector('[name=to-token]').innerHTML = options;
}

getTopTokens()
    .then(getTopAddresses)
    .then(renderDropDown);
