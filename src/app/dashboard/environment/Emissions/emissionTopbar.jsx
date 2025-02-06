"use client";
import React from "react";

const EmissionTopBar=({toggleDrawer,apiData,sdgData,griData})=>{
    const materialityEnvData=apiData&&apiData.environment?apiData.environment:{}
    return (
        <>
         <div className="flex justify-between items-center border-b border-gray-200 mb-5 w-full">
              <div className="w-full">
                <div className="text-left mb-4 ml-3 pt-5">
                  <p className="text-[11px]">Environment</p>
                  <div className="flex h-[28px]">
                    <div className="h-[28px]">
                      <p className="gradient-text text-[22px] font-bold h-[28px] pt-1">
                        Emission
                      </p>
                    </div>
                    {materialityEnvData&&materialityEnvData.EnvGhgEmission?.is_material_topic?(
                    <div className="bg-gray-100 h-[22px] w-[100px]  mx-2 mt-2 rounded-md">
                    <p className="text-gray-500 text-[12px] pt-0.5 px-2">
                      Material Topic
                    </p>
                  </div>
                ):(
                    <div></div>
                )}
                  </div>
                  
                </div>
              </div>
             


              <div className="w-full float-end pt-5 me-1">
            <div className="float-end border-l">
              <div className="flex mb-2">
              {griData&&griData.map((val)=>(
                    <button
                    className={`text-[${val.textColor}] ${val.bgColor} rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5`}
                    onClick={() => toggleDrawer(val.toggle)}
                  >
                    {val.tagName}
                  </button>
                ))}
              </div>
              <div className="flex">
              {sdgData&&sdgData.map((val)=>(
                    <button
                    className={`text-[${val.textColor}] ${val.bgColor} rounded-full text-[11px] w-[72px] h-[22px] ml-2 text-center pt-0.5`}
                    onClick={() => toggleDrawer(val.toggle)}
                  >
                    {val.tagName}
                  </button>
                ))}
              </div>
                
              
              
            </div>
          </div>
            </div>
        </>
    )
}

export default EmissionTopBar