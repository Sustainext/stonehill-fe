'use client'
import { useState, useRef, useEffect } from "react";
import RatioTable2 from "../tables/ratioTable2";

const Section14=({section9_3_8Ref,data,
    sectionNumber = "9.3.8",
    sectionTitle = 'Annual Compensation Ratio',
    sectionOrder = 9,
})=>{
    const col=[
        "Ratio of annual total compensation",
        "Ratio of percentage  increase in annual total compensation",
        
    ]
    const values=data["2_21_a_analyse_governance"]?data["2_21_a_analyse_governance"]:[]
    return (
        <>
        <div id="section9_3_8" ref={section9_3_8Ref} >
        
            <h3 className="text-[15px] text-[#344054] mb-4 text-left font-semibold">
           {sectionNumber} {sectionTitle}
            </h3>
            <p className="text-sm mb-4">
                {
                    data['2_21_c']?data['2_21_c']:'No data available'
                }
            </p>
            

           
           
           
           
           
           
           
           
           
            <p className="text-[15px] text-[#344054] mb-2 font-semibold">
            Ratio of annual total compensation & ratio of percentage increase in annual total compensation 
            </p>
            <div className="shadow-md rounded-md mb-4">
                <RatioTable2 col={col} values={values}/>
            </div>
            
        
        </div>
        </>
    )
}

export default Section14