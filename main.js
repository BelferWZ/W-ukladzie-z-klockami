let data;

function preload() {
	data = loadJSON("info.json", insertData, errorMsg);

	let params = getURLParams();
	if (Object.keys(params).length > 0 && params.save) {
		let decodedStr = '';
		let keys = [];
		let str = params.save;

		decodedNumber = str.match(/\d+/g).map(String);

		for (let i = 0; i < decodedNumber.length; i++) {
			let data = {
				quantity: decodedNumber[i],
				value: str[str.indexOf(decodedNumber[i]) + decodedNumber[i].length]
			}
			keys.push(data)
		} console.table(keys);

		for (key of keys) {
			let str = '';

			let max = parseInt(key.quantity, 10)

			for (let i = 0; i < max; i++) {
				str += key.value;
			}
			decodedStr += str;
		}

		Global['seed'] = decodedStr;
	}
}

function insertData() {
	let title = data.title;
	let name = data.name;
	let ver = data.version;
	let date = data.date;

	let footer = `Wersja: ${ver} z dnia: ${date}`

	select('.header').html(title);
	select('title').html(title);
	select('.name').html(name);
	select('.footer').html(footer);
}

function errorMsg() {
	console.log("Brak pliku info.json!");
}