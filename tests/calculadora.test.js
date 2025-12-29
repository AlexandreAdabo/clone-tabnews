const calculadora = require('../models/calculadora');

test('soma 1 + 2 para ser igual a 3', () => {
  const resultado = calculadora.somar(1, 2);
  expect(resultado).toBe(3);
});

test('soma 5 + 100 para ser igual a 105', () => {
  const resultado = calculadora.somar(5, 100);
  expect(resultado).toBe(105);
});

test('soma "banana" + 100 para ser igual a "Erro"', () => {
  const resultado = calculadora.somar('banana', 100);
  expect(resultado).toBe('Erro');
});
