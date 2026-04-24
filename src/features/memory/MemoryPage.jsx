const buttons = ['A', 'B', 'C', 'D'];

export function MemoryPage() {
  return (
    <section className="page-fill grid grid-rows-2">
      <div className="grid grid-cols-4">
        {buttons.map((button) => (
          <button key={button} type="button" className="border border-gray-300">
            {button}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <div className="h-5 w-5 bg-[#cccccc]" />
      </div>
    </section>
  );
}
