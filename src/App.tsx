import { SelectMultiple } from './select-multiple/select-multiple';

const items = Array.from({ length: 5 }, (_, index) => ({
  id: index.toString(),
  textValue: `Item ${index}`,
}));

function App() {
  return (
    <div>
      <SelectMultiple items={items}>
        {({ textValue }) => (
          <SelectMultiple.Item>{textValue}</SelectMultiple.Item>
        )}
      </SelectMultiple>
    </div>
  );
}

export default App;
