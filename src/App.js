import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
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
        setLoading(false);
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

  function handleClick(id) {
    let a = data.filter((item) => item._id !== id);
    setData(a);
    let b = JSON.parse(localStorage.getItem("data"));
    let c = b.filter((item) => item._id !== id);
    localStorage.setItem("data", JSON.stringify(c));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let coin = document.getElementById("coin");
    let rate = document.getElementById("rate");
    let a = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${coin.value}&tsyms=USD`
    );
    let b = await a.json();
    let currentRate = b.USD.toString();
    let _id = uuidv4();
    let c = [...data, { _id, coin: coin.value, rate: rate.value }];
    localStorage.setItem("data", JSON.stringify(c));
    setData([
      ...data,
      { _id, coin: coin.value, rate: rate.value, currentRate },
    ]);
    coin.value = "";
    rate.value = "";
  }

  return (
    <div className="App container">
      <div className="icon">
        <h2>MirindaWeb Crypto-Trading Analyzer</h2>
        <i
          className="fas fa-redo-alt"
          onClick={() => window.location.reload()}
        ></i>
      </div>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              <input type="text" id="coin" placeholder="Coin" />
            </div>
            <div>
              <input type="text" id="rate" placeholder="Buying Rate" />
            </div>
            <button type="submit">Submit</button>
          </form>
          <table className="styled-table table-tab">
            <thead>
              <tr>
                <th>No.</th>
                <th>Coin</th>
                <th>Buying Rate</th>
                <th>Current Rate</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1} </td>
                  <td>{item.coin.toUpperCase()} </td>
                  <td>${item.rate}</td>
                  <td>${item.currentRate}</td>
                  <td
                    style={{
                      backgroundColor:
                        item.currentRate - item.rate > 0
                          ? "#3dd525"
                          : "#ff0000",
                    }}
                  >
                    {item.currentRate - item.rate > 0
                      ? "+" +
                        (
                          ((item.currentRate - item.rate) / item.rate) *
                          100
                        ).toFixed(2)
                      : (
                          ((item.currentRate - item.rate) / item.rate) *
                          100
                        ).toFixed(2)}
                    %
                  </td>
                  <td
                    style={{ cursor: "pointer", color: "#ff0000" }}
                    onClick={() => handleClick(item._id)}
                  >
                    Delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
