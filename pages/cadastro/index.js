import { useState } from 'react';

export default function RegisterPage() {
  console.log('Render do <RegisterPage />');

  const [newCount, setNewCount] = useState(0);
  const [items, setItems] = useState([]);

  function newIncrement() {
    console.log(`NEW Incrementando count de ${newCount} para ${newCount + 1}`);
    setNewCount(newCount + 1);
  }

  function pushNewItem() {
    const newItem = Math.floor(Math.random() * 1000);

    const newItems = [...items, newItem];
    console.log('Item: ', items);
    console.log('New Items: ', newItems);
    setItems(newItems);
  }

  return (
    <>
      <h1>Cadastro de Usuário: </h1>
      <h1>newCount: {newCount}</h1>
      <button onClick={newIncrement}>Incrementar (novo)</button>
      <button onClick={pushNewItem}>Adicionar item</button>
      <h1>Items: {items.join(', ')}</h1>
      <hr />
      <ComponenteA />
      <ComponenteB />
    </>
  );
}

function ComponenteA() {
  console.log('Render do <ComponenteA />');
  return <h1>ComponenteA</h1>;
}

function ComponenteB() {
  console.log('Render do <ComponenteB />');
  return <h1>ComponenteB</h1>;
}
