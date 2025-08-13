export default function Policy() {
  return (
    <main className="bg-black text-white min-h-screen px-8 py-12 font-sans">
      <h1 className="text-3xl font-bold mb-8">Store Policies</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Shipping Policy</h2>
        <p className="text-gray-300">
          All orders are processed within 1–4 business days unless otherwise stated.  
          Shipping times may vary depending on the destination.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Changes & Cancellations</h2>
        <p className="text-gray-300">
          Orders cannot be changed or cancelled once they have been processed.  
          Please double-check all details before placing your order.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Privacy Policy</h2>
        <p className="text-gray-300">
          We value your privacy. Personal information is used solely for processing your order  
          and for necessary communication related to it.
        </p>
      </section>
    </main>
  );
}
