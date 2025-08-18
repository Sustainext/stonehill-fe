'use client'
import { useState, useRef, useEffect } from "react";


const RatioTable=({col,values,tableData})=>{

    
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
        <tr className="text-[13px]">
        {/* Loop through the values from the data object */}
        {tableData ? tableData?.map((item, index) => (
            <td key={index} className="border border-gray-200 p-4 text-left">
                {item}
            </td>
        ))
        :
        /* Loop through the 'values' array to render its items */
        values?.map((val, index) => (
            <td key={index} className="border border-gray-200 p-4 rounded-bl-md text-left">
                {val}
            </td>
        ))}
    </tr>
           
        </tbody>
    </table>
</div>

        </>
    )
}
export default RatioTable