export default function Pricing({ price, sharing }) {
    return (
        <div className="items-start self-stretch flex w-full justify-between gap-5 mt-4">
            <div className="text-teal-950 text-l leading-5 tracking-normal self-stretch">{sharing} Sharing </div>
            <div className="text-teal-950 text-l font-bold leading-5 tracking-normal self-stretch whitespace-nowrap">
                <span className="">from </span>
                <span className="font-bold">&#8377; {price}</span>
            </div>
        </div>
    )
}