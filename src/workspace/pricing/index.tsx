import { PricingTable } from '@clerk/clerk-react'

function Pricing() {
return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-6 pt-20">
      <div className="w-full max-w-4xl text-center">
        <h2 className="font-bold text-4xl text-gray-800 mb-6">Pricing ⚡</h2>
        <p className="text-gray-600 mb-10">
        Starts Creathing Unlimited PPT 🚀
        </p>
        <div className="flex justify-center">
          <PricingTable />
        </div>
      </div>
    </div>
  );

}

export default Pricing