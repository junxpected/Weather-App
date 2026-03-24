global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({
      name: "Rivne",
      main: { temp: 10.5, humidity: 80, feels_like: 8 },
      wind: { speed: 5 },
      weather: [{ main: "Clouds" }],
      coord: { lat: 50.6, lon: 26.2 }
    }),
  })
);

test('checkWeather має успішно отримувати дані', async () => {
    const { checkWeather } = require('../app');
    // Оскільки функція маніпулює DOM, у чистому Jest без JSDOM 
    // ми просто перевіряємо факт виклику fetch
    await checkWeather("Rivne");
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("Rivne"));
});