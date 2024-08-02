let priceData = [];
var price_data_url = "https://interview.switcheo.com/prices.json"
var sendToken = "";
var receiveToken = "";

// Function when send input field is updated
function updateSend() {
    var inputValue = document.getElementById('send-amount').value;
    if (sendToken != "" && receiveToken != "") {
        var sendTokenPrice = priceData.find(token => token.currency === sendToken).price;
        var receiveTokenPrice = priceData.find(token => token.currency === receiveToken).price;
        var ratio = sendTokenPrice / receiveTokenPrice;
        document.getElementById('receive-amount').value = `${(ratio * inputValue).toFixed(8)}`;
    }
}

// Attach the function to the send input field's 'input' event
document.getElementById('send-amount').addEventListener('input', updateSend);

// Function when receive input field is updated
function updateReceive() {
    var inputValue = document.getElementById('receive-amount').value;
    if (sendToken != "" && receiveToken != "") {
        var sendTokenPrice = priceData.find(token => token.currency === sendToken).price;
        var receiveTokenPrice = priceData.find(token => token.currency === receiveToken).price;
        var ratio = sendTokenPrice / receiveTokenPrice;
        document.getElementById('send-amount').value = `${(inputValue / ratio).toFixed(8)}`;
    }
}

// Attach the function to the send input field's 'input' event
document.getElementById('receive-amount').addEventListener('input', updateReceive);

// Function when tokens are selected
function updateTokens() {
    if (sendToken != "" && receiveToken != "") {
        var sendTokenPrice = priceData.find(token => token.currency === sendToken).price;
        var receiveTokenPrice = priceData.find(token => token.currency === receiveToken).price;
        var ratio = sendTokenPrice / receiveTokenPrice;
        document.getElementById('exchangeRate').textContent = `1 ${sendToken} = ${ratio.toFixed(8)} ${receiveToken}`;
    }
}

// Function to run on page load
async function initialize() {
    try {
        // Show loading state
        document.getElementById('loading').style.display = 'block';
        document.getElementById('content').style.display = 'none';

        const response = await fetch(price_data_url);
        if (!response.ok) {
            throw new Error('Failed to fetch prices');
        }
        priceData = await response.json(); // Await the JSON promise
        //remove duplicates
        priceData = priceData.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.currency === value.currency
            ))
        );
        populateDropdown();
    } catch (error) {
        console.error(error); // Handle errors appropriately
    } finally {
        // Hide loading state and show content
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }
}

// Function to toggle dropdown visibility
function toggleSendDropdown() {
    document.getElementById('sendToken_dropdown').classList.toggle('show');
}
function toggleReceiveDropdown() {
    document.getElementById('receiveToken_dropdown').classList.toggle('show');
}

// Function to populate dropdown from the list
function populateDropdown() {
    const sendDropdown = document.getElementById('sendToken_dropdown');
    const receiveDropdown = document.getElementById('receiveToken_dropdown');
    sendDropdown.innerHTML = ''; // Clear existing items
    receiveDropdown.innerHTML = ''; // Clear existing items
    priceData.forEach(item => {
        const token_name = item["currency"];
        const send_div = document.createElement('div');
        send_div.className = 'dropdown-item';
        send_div.onclick = () => {
            document.querySelector('#senddropbtn').innerHTML = `<img src="Tokens/${token_name}.svg" class="dropdown-img" alt=""> <div class="selected-dropdown-text"> ${token_name} </div>`;
            sendDropdown.classList.remove('show');
            sendToken = token_name;
            updateTokens();
        };
        send_div.innerHTML = `<img src="Tokens/${token_name}.svg" class="dropdown-img" alt=""> <div class = "dropdown-text"> ${token_name} </div>`;
        sendDropdown.appendChild(send_div);
        const receive_div = document.createElement('div');
        receive_div.className = 'dropdown-item';
        receive_div.onclick = () => {
            document.querySelector('#receivedropbtn').innerHTML = `<img src="Tokens/${token_name}.svg" class="dropdown-img" alt=""> <div class="selected-dropdown-text"> ${token_name} </div>`;
            receiveDropdown.classList.remove('show');
            receiveToken = token_name;
            updateTokens();
        };
        receive_div.innerHTML = `<img src="Tokens/${token_name}.svg" class="dropdown-img" alt=""> <div class = "dropdown-text"> ${token_name} </div>`;
        receiveDropdown.appendChild(receive_div);

    });
}

// Close dropdown if clicked outside
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};
// Run the function when the page loads
window.onload = initialize;


// Function to highlight the entire text on focus
function highlightText() {
    this.select(); // Selects all text within the input field
}

// Attach the function to the input field's 'focus' event
document.getElementById('send-amount').addEventListener('focus', highlightText);
document.getElementById('receive-amount').addEventListener('focus', highlightText);

function confirmSubmit() {
    var toast = document.getElementById('toast');
    if (sendToken != "" && receiveToken != "" && document.getElementById('send-amount').value != 0 && document.getElementById('receive-amount').value != 0) {
        toast.textContent = "Swap completed";
    } else if (sendToken != "" && receiveToken != "") {
        toast.textContent = "Please enter an amount";
    } else {
        toast.textContent = "Please select tokens";
    }
    toast.classList.add('show');
    setTimeout(function () {
        toast.classList.remove('show');
    }, 2000); // Hide after 2 seconds
}