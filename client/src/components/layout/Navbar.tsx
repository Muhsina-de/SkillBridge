const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">SkillBridge</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn btn-primary">Sign In</button>
            <button className="btn bg-gray-100 hover:bg-gray-200">Sign Up</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 