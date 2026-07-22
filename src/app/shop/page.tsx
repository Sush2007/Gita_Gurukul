import Image from "next/image";

export default function Shop() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="max-w-[1280px] w-full mx-auto pt-[120px] pb-8 px-6 lg:px-[60px]">
        <div className="flex flex-col gap-4 mb-12 border-b border-gray-200 pb-8">
          <h1 className="font-display font-black text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-brand-dark">
          Curated Editions
        </h1>
        <p className="font-body text-base lg:text-lg text-gray-700 max-w-2xl">
          Discover our collection of beautifully bound Bhagavad Gita diaries,<br />
          designed for reflection and daily wisdom.
        </p>
      </div>
      
      <div className="w-full">
        {/* Main Product Area */}
        <main className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
          <div className="w-full lg:w-[450px] flex-shrink-0 relative bg-gray-50 p-6 lg:p-10 border border-gray-100 rounded-sm flex items-center justify-center">
            <Image 
              src="/images/screenshot_from_2026_07_12_18_39_10_1.png" 
              alt="Gita Gurukul Diary" 
              width={400} 
              height={400} 
              className="w-full max-w-[350px] h-auto object-contain drop-shadow-xl hover:scale-105 transition duration-500"
            />
          </div>
          
          <div className="w-full lg:flex-1 flex flex-col gap-6">
            <div>
              <h2 className="font-display font-black text-4xl lg:text-[56px] leading-[1.1] tracking-tight text-brand-dark mb-4">Gita Gurukul Diary</h2>
              <p className="font-body text-base text-gray-600">
                A perfect companion for daily reflection. Features 27 handpicked shlokas carefully curated to bring calmness and focus.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="font-body text-base font-semibold text-brand-dark">Quantity:-</span>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 border border-gray-300 flex items-center justify-center text-xl hover:bg-gray-100 transition">-</button>
                <span className="font-body text-lg w-10 text-center">1</span>
                <button className="w-10 h-10 border border-gray-300 flex items-center justify-center text-xl hover:bg-gray-100 transition">+</button>
              </div>
            </div>
            
            <button 
              className="bg-brand-primary text-white font-button font-medium text-lg py-3 px-8 mt-4 rounded-md shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all disabled:opacity-50"
              disabled
            >
              Proceed to checkout
            </button>
            <p className="text-sm text-gray-500 italic">
              *Checkout is currently disabled.
            </p>
          </div>
        </main>
      </div>
      </div>
    </div>
  );
}
