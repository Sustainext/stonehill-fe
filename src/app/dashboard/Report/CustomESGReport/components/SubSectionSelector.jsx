'use client';
import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectEnabledSections,
  selectSubsections,
  selectSelectedSubsections,
  setSelectedSubsections,
  updateSelectedSubsections,
} from '../../../../../lib/redux/features/reportBuilderSlice';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubsectionSelector = forwardRef(({ onBack, onNext }, ref) => {
  const dispatch = useDispatch();
  const enabledSections = useSelector(selectEnabledSections);
  const subsections = useSelector(selectSubsections);
  const selectedSubsections = useSelector(selectSelectedSubsections);

 

  useImperativeHandle(ref, () => ({
    handleProceed,
  }));

  // Initialize selected subsections when component mounts or enabled sections change
  // useEffect(() => {
  //   const shouldInitialize = enabledSections.some(section => 
  //     !selectedSubsections[section.id] || selectedSubsections[section.id].length === 0
  //   );

  //   if (shouldInitialize) {
  //     const initialSelections = { ...selectedSubsections };
      
  //     enabledSections.forEach((section) => {
  //       if (!initialSelections[section.id]) {
  //         const sectionSubsections = subsections[section.id] || [];
  //         const collectIds = (subs) => 
  //           subs.flatMap((s) => [
  //             s.enabled ? s.id : null, 
  //             ...(s.children ? collectIds(s.children) : [])
  //           ]).filter(Boolean);
          
  //         initialSelections[section.id] = collectIds(sectionSubsections);
  //       }
  //     });
      
  //     dispatch(setSelectedSubsections(initialSelections));
  //   }
  // }, [enabledSections, subsections, selectedSubsections, dispatch]);

  // const toggleSubsection = (sectionId, subsectionId) => {
  //   const currentSelections = selectedSubsections[sectionId] || [];
  //   const updatedSelections = currentSelections.includes(subsectionId)
  //     ? currentSelections.filter(id => id !== subsectionId)
  //     : [...currentSelections, subsectionId];
    
  //   dispatch(updateSelectedSubsections({ 
  //     sectionId, 
  //     subsectionIds: updatedSelections 
  //   }));
  // };

  const toggleSubsection = (sectionId, subsection) => {
    const currentSelections = selectedSubsections[sectionId] || [];
    const isChecked = currentSelections.includes(subsection.id);
  
    let updatedSelections;
  
    const collectAllChildren = (node) => {
      return [
        ...(node.children?.flatMap(collectAllChildren) || []),
        node.id
      ];
    };
  
    const allChildren = collectAllChildren(subsection).filter(id => id !== subsection.id);
  
    if (isChecked) {
      // Remove parent and all its children
      updatedSelections = currentSelections.filter(id => id !== subsection.id && !allChildren.includes(id));
    } else {
      // Add parent and children
      updatedSelections = [...new Set([...currentSelections, subsection.id, ...allChildren])];
    }
  
    dispatch(updateSelectedSubsections({ sectionId, subsectionIds: updatedSelections }));
  };
  

  // const renderSubsection = (sectionId, subsection, level = 0) => {
  //   const currentSelections = selectedSubsections[sectionId] || [];
  //   const isChecked = currentSelections.includes(subsection.id);

  //   return (
  //     <div key={subsection.id} className={`${level > 0 ? `pl-${level * 4}` : ''} mb-2`}>
  //       <label className="flex items-center space-x-2 cursor-pointer">
  //         <input
  //           type="checkbox"
  //           checked={isChecked}
  //           onChange={() => toggleSubsection(sectionId, subsection.id)}
  //           className="w-4 h-4 green-checkbox cursor-pointer"
  //         />
  //         <span className={`text-[14px] ${subsection.children ? 'font-medium' : ''} text-[#2E0B34]`}>
  //           {subsection.label}
  //         </span>
  //       </label>
        
  //       {subsection.children && subsection.children.length > 0 && (
  //         <div className="mt-1">
  //           {subsection.children.map((child) => 
  //             renderSubsection(sectionId, child, level + 1)
  //           )}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

 
  const renderSubsection = (sectionId, subsection, level = 0, parentChecked = true) => {
    const currentSelections = selectedSubsections[sectionId] || [];
    const isChecked = currentSelections.includes(subsection.id);
    const isDisabled = !parentChecked;
  
    return (
      <div key={subsection.id} className={`${level > 0 ? `pl-${level * 4}` : ''} mb-2`}>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            disabled={isDisabled}
            onChange={() => toggleSubsection(sectionId, subsection)}
            className="w-4 h-4 green-checkbox flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <span className={`text-[14px] ${subsection.children ? 'font-medium' : ''} text-[#2E0B34] ${isDisabled ? 'opacity-50' : ''}`}>
            {subsection.label}
          </span>
        </label>
  
        {subsection.children?.length > 0 && (
          <div className="mt-1">
            {subsection.children.map((child) =>
              renderSubsection(sectionId, child, level + 1, isChecked)
            )}
          </div>
        )}
      </div>
    );
  };
  
  // const handleProceed = () => {
  //   // Check if at least one subsection is selected across all sections
  //   const hasSelections = Object.values(selectedSubsections).some(
  //     selections => selections && selections.length > 0
  //   );
    
  //   if (hasSelections) {
  //     onNext();
  //   } else {
  //     alert('Please select at least one subsection to proceed.');
  //   }
  // };


  const handleProceed = () => {
    const hasAllSectionsValid = enabledSections.every(section => {
      const selections = selectedSubsections[section.id] || [];
      return selections.length > 0;
    });
  
    if (!hasAllSectionsValid) {
      toast.warn('Please select at least one subsection in each selected section to proceed.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      // alert('');
      return;
    }
  
    onNext();
  };
  
  const renderSectionSubsections = (section, index) => {
    const sectionSubsections = subsections[section.id] || [];
    
    if (sectionSubsections.length === 0) {
      return (
        <div key={section.id} className='border-b border-gray-200 pb-4'>
          <h3 className="mb-3 font-medium text-[#2E0B34] text-[16px]">
            {index + 1}. {section.title}
          </h3>
          <p className="text-sm text-gray-500 italic">
            No subsections available for this section.
          </p>
        </div>
      );
    }

    return (
      <div key={section.id} className='border-b border-gray-200 pb-4'>
        <h3 className="mb-2 font-medium text-[#2E0B34] text-[16px]">
          {index + 1}. {section.title}
        </h3>
        <div className='mb-4'>
          {sectionSubsections.map((subsection) => 
            renderSubsection(section.id, subsection, 0)
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="space-y-6 border border-gray-400 p-6 rounded-md">
        {enabledSections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No sections enabled. Please go back and select sections first.</p>
          </div>
        ) : (
          enabledSections.map((section, idx) => 
            renderSectionSubsections(section, idx)
          )
        )}
      </div>

      {/* <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleProceed}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={enabledSections.length === 0}
        >
          Proceed to Report →
        </button>
      </div> */}

      {/* Debug information - remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <strong>Debug Info:</strong>
          <div>Enabled Sections: {enabledSections.map(s => s.id).join(', ')}</div>
          <div>Selected Subsections: {JSON.stringify(selectedSubsections, null, 2)}</div>
        </div>
      )} */}
    </div>
  );
})

export default SubsectionSelector