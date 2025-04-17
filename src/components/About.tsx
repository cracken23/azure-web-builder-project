
const About = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          About <span className="text-azure-500">Me</span>
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-azure-400 to-azure-600 rounded-2xl p-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl aspect-square flex items-center justify-center">
              <svg className="w-3/4 h-3/4 text-azure-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">College Student & Azure Enthusiast</h3>
            <p className="text-gray-700 mb-4">
              I'm a passionate computer science student with a focus on cloud technologies and web development. 
              With expertise in React front-end development and Microsoft Azure, I create scalable, cloud-native applications.
            </p>
            <p className="text-gray-700">
              This portfolio showcases my ability to integrate modern web technologies with Azure cloud services, 
              demonstrating my skills in full-stack development and cloud architecture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
