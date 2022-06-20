
currencyRatios = [];
document.addEventListener('localDataLoaded', () => {
	mapCurrencyInputs();
	setInterval(autoRefresh, 5 * 60 * 1000);
	let exPrice = document.querySelector('.local-data.exa').value;
	exPrice = exPrice ? exPrice : 0;
	document.querySelector('#ex-ratio-tracker .exa.ex.exalted').value = exPrice;
	buildExRatios(exPrice);
});

function loadCurrency() {
	var host = 'poe';
	host += '.ninja';
	var league = document.getElementById('league').value;
	var path = 'https://' + host + '/api/data/currencyoverview?league=' + league + '&type=Currency&language=en';

    const options = {
		host: host,
		port: 443,
		path: path,
  		method: 'GET',
		headers: { 'User-Agent': 'Mozilla/5.0' }
	};
	
	var data = '';
	const req = https.request(options, res =>  {
		if(res.statusCode == 200) {
			res.setEncoding('utf8');
		  	res.on('data', d =>  { data += d; })
		  	res.on('end', d => { loadCurrencyAjax(data); })
		}
		else console.log('Bad request: ' + res.statusCode);
	})

	req.on('error', error => { console.error(error) });
	req.end()
}

var mapCurrencyInputs = function mapCurrencyInputs()
{
	var currencyInputs = document.querySelectorAll('#currency-body-modal input');
	for (var i = 0; i < currencyInputs.length; i++) {
		var cssClasses = currencyInputs[i].classList;
		for (var j = 0; j < cssClasses.length; j++) {
			var cssClass = cssClasses[j];
			if(cssClass != null && cssClass != 'local-data' && cssClass.length > 0) {
				currencyRatios[cssClass] = currencyInputs[i];
			}
		}
	}
}

var loadCurrencyAjax = function(data) {
	let json = JSON.parse(data);
	let lines = json.lines;

	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		var currencyName = line.currencyTypeName;
		var elements = document.getElementsByName(currencyName);
		if(elements != null) {
			for(var j = 0; j < elements.length; j++) {
				elements[j].value = line.chaosEquivalent;
				if(elements[j].onchange){ elements[j].onchange() }
			}
		}
	}
};

var autoRefresh = function() {
	var autoLoad = document.getElementById('auto-load');
	if(autoLoad.checked) loadCurrency();
};

function buildExRatios(exPrice) {
	var container = document.getElementById('ex-ratio-tracker-fill');
	container.innerHTML = '';
	for(var i = 1; i < 10; i++) {
		var baseNode = document.getElementById('ex-ratio-tracker').cloneNode(true);
		baseNode.id = '';
		var input = baseNode.querySelector('input');
		baseNode.querySelector('.ex-fraction').innerHTML = (.1 * i).toFixed(1);
		input.value = (.1 * i * exPrice).toFixed(1);
		input.className = '';
		input.onchange = '';
		container.append(baseNode);
	}	
}