export default function Policy() {
  return (
    <main className="bg-black text-white min-h-screen px-8 py-12 font-sans">
      <h1 className="text-3xl font-bold mb-8">Store Policies</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Returns & Exchanges</h2>
        <p className="text-gray-300">
          We accept returns and exchanges on unworn, unwashed items within 14 days of delivery.
          Customers are responsible for return shipping unless the item is defective or incorrect.
          Items marked “final sale” cannot be returned or exchanged.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Shipping Policy</h2>
        <p className="text-gray-300">
          All orders are processed within 2-4 business days. Shipping times may vary based on destination.
          We are not responsible for lost or stolen packages once marked as delivered.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Changes & Cancellations</h2>
        <p className="text-gray-300">
          Orders cannot be changed or cancelled after they have been processed.
          Please double-check your shipping information and items before placing an order.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Sales & Promotions</h2>
        <p className="text-gray-300">
          Sale items and promotional purchases are final sale unless otherwise stated.
          We reserve the right to change or end promotions at any time.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Privacy Policy</h2>
        <p className="text-gray-300">
          We value your privacy. Personal information is used only for order processing and communication.
          For full details, see our dedicated <a href="/policy" className="underline text-white">Privacy Policy</a>.
        </p>
      </section>
    </main>
  );
}
