const conversor = document.getElementById("conversor");
const coinSelector = document.getElementById("coinSelector");
const result = document.getElementById("result");
const mindicador = "https://mindicador.cl/api/";
const ufindicador = "https://mindicador.cl/api/uf";
const dolarindicador = "https://mindicador.cl/api/dolar";
const euroindicador = "https://mindicador.cl/api/euro";
const utmindicador = "https://mindicador.cl/api/utm";
let myChart;

async function getCoinsValue() {
	const res = await fetch(mindicador);
	const datos = await res.json();

	let arrayCoins = [];

	try {
		arrayCoins.push(datos.uf);
		arrayCoins.push(datos.dolar);
		arrayCoins.push(datos.euro);
		arrayCoins.push(datos.utm);

		return arrayCoins;
	} catch (e) {
		console.error(e.message);
	}
}

async function exchangeCoin() {
	let arrayCoins = await getCoinsValue();
	const inputCoin = document.getElementById("inputCoin").value;
	const selectChange = coinSelector.options[coinSelector.selectedIndex].value;

	let valueChange;

	try {
		for (let i = 0; i < arrayCoins.length; i++) {
			if (arrayCoins[i].codigo == selectChange) {
				valueChange = arrayCoins[i].valor;
			}
		}
		if (valueChange === undefined) {
			alert("El tipo de moneda seleccionado no existe");
		} else {
			let exchangeResult = inputCoin / valueChange;
			result.innerHTML = ": $" + exchangeResult.toFixed(2);
		}
	} catch (e) {
		console.error(e.message);
	}
}

conversor.addEventListener("submit", (e) => {
	e.preventDefault();
	exchangeCoin();
});

async function getCoinsData(api) {
	try {
		const res = await fetch(api);
		const dataIndicador = await res.json();
		return dataIndicador;
	} catch (e) {
		console.error(e.message);
	}
}

async function graphicConfig(coinsData) {
	const typeGraphic = "line";
	const tittle = "Valor historico";
	const lineColor = "green";

	try {
		const date = coinsData.serie.map((serie) => {
			newDate = new Date(serie.fecha);
			return newDate.toLocaleDateString("en-US");
		});
		const value = coinsData.serie.map((serie) => serie.valor);

		const config = {
			type: typeGraphic,
			data: {
				labels: date,
				datasets: [
					{
						label: tittle,
						backgroundColor: lineColor,
						data: value,
					},
				],
			},
		};
		return config;
	} catch (e) {
		console.error(e.message);
	}
}

async function renderGraphic(coinsData) {
	const config = await graphicConfig(coinsData);
	const ChartDOM = document.getElementById("myChart");

	try {
		if (myChart) {
			myChart.destroy();
		}
		myChart = new Chart(ChartDOM, config);
	} catch (e) {
		console.error(e.message);
	}
}

coinSelector.addEventListener("change", (e) => {
	e.preventDefault();
	let coinsData;
	const selectChange = e.target.value;

	try {
		switch (selectChange) {
			case "uf":
				coinsData = getCoinsData(ufindicador);
				break;
			case "dolar":
				coinsData = getCoinsData(dolarindicador);
				break;
			case "euro":
				coinsData = getCoinsData(euroindicador);
				break;
			case "utm":
				coinsData = getCoinsData(utmindicador);
				break;
			default:
				alert("Error no existe el tipo de cambio seleccionado");
		}
	} catch (e) {
		console.error(e.message);
	}

	coinsData
		.then(function (coinsData) {
			renderGraphic(coinsData);
		})
		.catch(function (error) {
			console.log("No pude obtener datos");
		});
});
