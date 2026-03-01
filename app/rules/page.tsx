export default function RulesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Dress Code Rules
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-lg text-gray-600 mb-8 text-center">
            College uniform guidelines and compliance rules will be displayed here.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-xl">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Boys Uniform</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• White shirt (full sleeves)</li>
                <li>• Black trousers</li>
                <li>• Black shoes</li>
                <li>• College ID card</li>
              </ul>
            </div>
            <div className="p-6 bg-pink-50 rounded-xl">
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Girls Uniform</h3>
              <ul className="space-y-2 text-pink-700">
                <li>• White salwar kameez</li>
                <li>• Blue dupatta</li>
                <li>• Black shoes</li>
                <li>• College ID card</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
