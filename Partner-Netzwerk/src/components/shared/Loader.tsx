

// Define a functional component named Loader
const Loader = () => {
  // Return JSX to render a loader component
  return (
    <div className="flex-center w-full">  {/* Container div with flexbox centered content and full width */}
      <img 
        src="/assets/icons/loader.svg"  
        alt="loader"                       
        width={24}                         
        height={24}                        
      />
    </div>
  )
}

// Export the Loader component as the default export
export default Loader
