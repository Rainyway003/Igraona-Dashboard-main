const LandingCountBox = ({
  Icon,
  title,
  number,
  description,
}) => {
  return (
    <div className="bg-[#131313] p-12 rounded-lg shadow-lg text-center w-full">
      <div className="flex justify-between items-center">
        <div className="bg-[#D01F25] text-white p-6 rounded-full">
          <Icon className='!w-10 !h-10'></Icon>
        </div>
        <div className='flex flex-col items-center'>
          <h5 className="text-gray-500 uppercase text-2xl">{title}</h5>
          <span className="text-6xl font-bold">{number}</span>
        </div>
      </div>
      <p className="text-gray-500 text-xl mt-6">{description}</p>
    </div>
  )
}

export default LandingCountBox;