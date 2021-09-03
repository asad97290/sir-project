import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      if (
        localStorage.getItem("data") === null ||
        localStorage.getItem("data") === "null"
      ) {
        localStorage.setItem("data", null);
        setData([]);
      } else {
        let res = localStorage.getItem("data");

        let arr = JSON.parse(res);
        let array = [];
        for (let i = 0; i < arr.length; i++) {
          let a = await fetch(
            `https://min-api.cryptocompare.com/data/price?fsym=${arr[i].coin}&tsyms=USD`
          );
          let b = await a.json();
          let currentRate = b.USD.toString();
          array.push({ coin: arr[i].coin, rate: arr[i].rate, currentRate });
        }
        setData(array);
        setLoading(false);
      }
    }

    getData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    let coin = document.getElementById("coin");
    let rate = document.getElementById("rate");
    let a = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${coin.value}&tsyms=USD`
    );
    let b = await a.json();
    let currentRate = b.USD.toString();
    let c = [...data, { coin: coin.value, rate: rate.value }];
    localStorage.setItem("data", JSON.stringify(c));
    setData([...data, { coin: coin.value, rate: rate.value, currentRate }]);
    coin.value = "";
    rate.value = "";
  }

  return (
    
    <div className="App">
    
   {loading  ?<h1>Loading...</h1>:(
      <>
        <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="coin">COIN:</label>
          <input type="text" id="coin" />
        </div>
        <div>
          <label htmlFor="rate">RATE:</label>
          <input type="text" id="rate" />
        </div>
        <button type="submit">Submit</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Buy Rate (USD)</th>
            <th>Current Rate (USD)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.coin} </td>

              <td>{item.rate} </td>
              <td>{item.currentRate} </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>)}
    </div>

  );
}

export default App;
