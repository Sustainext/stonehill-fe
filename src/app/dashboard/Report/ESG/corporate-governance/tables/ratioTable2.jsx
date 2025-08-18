'use client'
import { useState, useRef, useEffect } from "react";


const RatioTable2=({col,values,tableData})=>{

    
    return (
        <>
       <div style={{ maxHeight: "400px", overflowY: "auto" }} className="mb-2">
    <table className="w-full border border-gray-200 rounded-md overflow-hidden">
        <thead className="gradient-background">
            <tr>
                {col.map((item, idx) => (
                    <th
                        key={idx}
                        style={{ minWidth: "120px", textAlign: "left" }}
                        className={`text-[12px] border-r px-4 py-4 ${
                            idx === 0 ? 'rounded-tl-md' : '' // Top-left corner
                        } ${
                            idx === col.length - 1 ? 'rounded-tr-md' : '' // Top-right corner
                        } text-gray-500`}
                    >
                        <div className="flex ">
                            <p className="flex">
                                {item}
                            </p>
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
        {values.length>0?values.map((val,index)=>(
            <tr key={index} className="text-[13px]">
                <td className="border border-gray-200 p-4 text-left">
                    {val.ratio_of_annual_total_compensation}
                </td>
                <td className="border border-gray-200 p-4 text-left">
                    {val.ratio_of_percentage_increase_in_annual_total_compensation}
                </td>
            </tr>
        )):(
            <tr className="text-[13px]">
                <td  className="border border-gray-200 p-4 text-left">
               No data available
            </td>
            <td  className="border border-gray-200 p-4 text-left">
               No data available
            </td>
            </tr>
        )}
       
           
        </tbody>
    </table>
</div>

        </>
    )
}
export default RatioTable2