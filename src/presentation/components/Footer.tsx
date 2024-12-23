export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">WorkoastWheels</h3>
            <p className="text-sm text-gray-400">Premium Car Rental Service</p>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} WorkoastWheels. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}; 