
const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-azure-50 to-white z-[-1]"></div>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Azure-Powered <span className="text-azure-500">Portfolio</span> Website
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            A modern web application with Azure database integration showcasing my cloud development skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#projects" 
              className="px-6 py-3 bg-azure-500 hover:bg-azure-600 text-white rounded-lg shadow-md transition-colors font-medium"
            >
              View Projects
            </a>
            <a 
              href="#contact" 
              className="px-6 py-3 bg-white hover:bg-gray-50 text-azure-600 border border-azure-200 rounded-lg shadow-sm transition-colors font-medium"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
