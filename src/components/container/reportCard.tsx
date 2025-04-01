type TReport = {
    title: string,
    totalPrice: string | number,
    description?: string | number,
    className?: string,
}
const ApReportSummaryCard = ({title, totalPrice, description, className} : TReport) => {
  return (
    <div className={`relative px-2 pt-1 pb-5 bg-transparent border rounded-lg cus-xs:p-3 bg-stone-100 ${className} overflow-hidden`}>
      <div className="absolute w-full left-1 bottom-2">
        <svg width="98%" viewBox="0 0 595 227" fill="#fffbf0" xmlns="http://www.w3.org/2000/svg">
          <path d="M102.858 26.4964L0 84.0741V227H595V0L494.396 84.0051L404.966 63.2969L304.264 159.209L203.561 121.062L102.858 26.4964Z" fill="#FFFBF0"/>
        </svg>
      </div>

      <div className="relative z-10">
        <h3 className="mb-5 text-sm">{title}</h3>
        <div className="mb-3 text-center">
            <h2 className="mb-2 text-xl text-primary">{totalPrice}</h2>
            <h3 className="text-base font-light text-alt-dark">{description ? `${description}` : ""}</h3>
        </div>
      </div>
    </div>
  )
}

export default ApReportSummaryCard