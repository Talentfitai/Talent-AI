import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold">TalentFit AI</h1>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 border border-white rounded hover:bg-blue-700">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-20">
        <h2 className="text-5xl font-bold mb-4">HR Assessment Platform</h2>
        <p className="text-xl mb-8 text-blue-100">
          Evaluasi kandidat dengan DISC, MBTI, dan IQ Test
        </p>
        <div className="space-x-4">
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100"
          >
            Mulai Sekarang
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border-2 border-white rounded-lg font-bold hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-8 px-8 py-16">
        <div className="bg-blue-500 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">DISC Assessment</h3>
          <p>Evaluasi kepribadian berdasarkan gaya komunikasi</p>
        </div>
        <div className="bg-blue-500 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">MBTI Test</h3>
          <p>Identifikasi tipe kepribadian dan preferensi kerja</p>
        </div>
        <div className="bg-blue-500 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">IQ Test</h3>
          <p>Ukur kemampuan kognitif dan problem solving</p>
        </div>
      </div>
    </div>
  );
}
