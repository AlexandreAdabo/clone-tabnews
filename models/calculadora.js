function somar(arg1, arg2) {
  if (typeof arg1 !== 'number' || typeof arg2 !== 'number') {
    return 'Erro';
  }
  return arg1 + arg2;
}

exports.somar = somar;
