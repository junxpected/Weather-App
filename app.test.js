const iconMap = {
    "Clear": "clear.svg",
    "Clouds": "clouds.svg",
    "Rain": "rain.svg",
    "Drizzle": "drizzle.svg",
    "Thunderstorm": "thunderstorm.svg",
    "Snow": "snow.svg",
    "Mist": "atmosphere.svg",
    "Fog": "atmosphere.svg"
};

const videoMap = {
    "Clear": "assets/video/Clear.mp4",
    "Clouds": "assets/video/Clouds.mp4",
    "Rain": "assets/video/Rain.mp4",
    "Drizzle": "assets/video/Drizzle.mp4",
    "Thunderstorm": "assets/video/Thunderstorm.mp4",
    "Snow": "assets/video/Snow.mp4",
    "Mist": "assets/video/Mist.mp4",
    "Fog": "assets/video/Fog.mp4"
};

const apiKeyParts = {
    part1: "75c13a7b",
    part2: "3104723b",
    part3: "ec569bb799333455"
};

describe('Weather App Technical Tests', () => {

    test('Завдання 2: Перевірка відповідності іконок станам погоди', () => {
        expect(iconMap["Clear"]).toBe("clear.svg");
        expect(iconMap["Clouds"]).toBe("clouds.svg");
        expect(iconMap["Rain"]).toBe("rain.svg");
        expect(iconMap["Snow"]).toBe("snow.svg");
    });

    test('Завдання 2: Перевірка шляхів до фонових відео', () => {
        expect(videoMap["Clear"]).toBe("assets/video/Clear.mp4");
        expect(videoMap["Thunderstorm"]).toBe("assets/video/Thunderstorm.mp4");
        expect(videoMap["Clouds"]).toContain(".mp4");
    });

    test('Завдання 5: Тест безпеки (збір API-ключа з частин)', () => {
        const fullKey = apiKeyParts.part1 + apiKeyParts.part2 + apiKeyParts.part3;
        expect(fullKey).toHaveLength(32);
        expect(fullKey).toBe("75c13a7b3104723bec569bb799333455");
    });

    test('Функціональний тест: Округлення температури', () => {
        expect(Math.round(22.4)).toBe(22);
        expect(Math.round(22.6)).toBe(23);
        expect(Math.round(-5.1)).toBe(-5);
    });

});