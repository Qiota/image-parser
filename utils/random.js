/**
 * Генерирует случайную строку.
 * @param {Number} min Минимальное количество символов
 * @param {Number} max Максимальное количество символов
 * @param {String} characters Строка символов, из которых будет формироваться случайная строка
 * @returns {String} Случайно сгенерированная строка
 */
module.exports = (min, max, characters) => {
  const length = Math.floor(Math.random() * (max - min + 1)) + min;
  let text = "";
  for (let i = 0; i < length; i++) {
    text += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return text;
};
