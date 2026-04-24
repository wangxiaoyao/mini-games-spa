export function OperationsPage() {
  return (
    <section className="page-fill flex items-center">
      <div className="flex h-[100px] w-full items-center justify-around bg-[rgb(200,255,255)]">
        <span>1</span>
        <div className="flex gap-2">
          <button type="button">+</button>
          <button type="button">-</button>
          <button type="button">x</button>
          <button type="button">÷</button>
        </div>
        <span>2</span>
        <span>=</span>
        <span>2</span>
      </div>
    </section>
  );
}
