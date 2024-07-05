const chartUrl = 'https://api.coingecko.com/api/v3/coins/toncoin/market_chart';
const params = {
  vs_currency: 'usd',
  days: '30',  // Lấy dữ liệu trong vòng 30 ngày
  interval: 'daily'  // Lấy dữ liệu hàng ngày
};

fetch(`${chartUrl}?vs_currency=${params.vs_currency}&days=${params.days}&interval=${params.interval}`)
  .then(response => response.json())
  .then(data => {
    const prices = data.prices.map(price => ({
      t: new Date(price[0]),
      o: price[1],
      h: price[2],
      l: price[3],
      c: price[4]
    }));

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [{
          label: 'TONCOIN Candlestick Chart',
          data: prices,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'TONCOIN Candlestick Chart'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Price (USD)'
            }
          }
        }
      }
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
