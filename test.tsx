const test = () => {
  const items = [1, 2, 3];
  return (
    <div>
      {items.map((item) => (
        <div key={item}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default test;