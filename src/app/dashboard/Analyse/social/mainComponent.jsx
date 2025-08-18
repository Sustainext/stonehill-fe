'use client';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Aside from './Aside';
import AnalyseEmployment from './Employment/page';
import AnalyseOHS from './OHS/page';
import AnalyseChildlabour from './Child-Labour/page';
import AnalyseCompulsorylabour from './Compulsory-Labour/page';
import AnalyseDiversityInclusion from './Diversity-and-inclusion/page';
import AnalyseSuppliersocialassessment from './Supplier-social-assessment/page';
import AnalyseTraining from './Training/page';
import AnalyseNonDiscrimination from './NonDiscrimination/page';
import AnalyseCollectiveBargaining from './Collective-Bargaining/page';
import AnalyseCustomerHealthSafety from './Customer-Health-Safety/page';
import AnalyseMarketingLabeling from './Marketing-Labeling/page';
import AnalyseCommunityDevelopment from './Community-Development/page';
import AnalyseCustomerprivacy from './Customer-Privacy/page';
import AnalyseSecurityPersonnelt from './Security-Personnel/page';
import AnalyseHumanRightsCommunityImpact from './Human-Rights-Community-Impact/page';
import {
  setHeadertext1,
  setHeadertext2,
  setHeaderdisplay,
  setMiddlename,
} from '../../../../lib/redux/features/topheaderSlice';
import { useDispatch } from 'react-redux';
const social = () => {
  const [activeTab, setActiveTab] = useState('Tab1');
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [mobileopen, setMobileopen] = useState(false);
  const dispatch = useDispatch();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileopen(false);
  };
  useEffect(() => {
    const headerTextMapping = {
      Tab1: 'Occupational health and safety',
      Tab2: 'Human Rights and Community Impact',
      Tab3: 'Labor Management',
      Tab4: 'Child and Forced Labour',
      Tab5: 'Employee hire and turnover',
      Tab6: 'Training and Development',
      Tab7: 'Customer Privacy & Data Security',
      Tab8: 'Product Safety & Quality',
      Tab9: 'Marketing and Labeling',
      Tab10: 'Supply Chain Labor Standards',
      Tab11: 'Diversity & Equal Opportunity',
      Tab12: 'Non-discrimination',
      Tab13: 'Marketing and Labeling',
      Tab14: 'Customer Privacy',
      Tab15: 'Security Personnel',
    };
    dispatch(setHeadertext1('Analyse'));
    dispatch(setHeaderdisplay('block'));
    dispatch(setHeadertext2(headerTextMapping[activeTab] || 'Social'));
    dispatch(setMiddlename('Social'));
  }, [activeTab, dispatch]);
  return (
    <div className='relative xl:flex lg:flex 2xl:flex 4k:flex justify-start w-full max-w-full overflow-hidden'>
      <div className='hidden xl:block lg:block md:hidden 2xl:block 4k:block 2k:block'>
        <div className='relative w-[199px] min-h-[90vh] py-[11px] flex-col items-end inline-flex flex-shrink-0 ml-6'>
          <Aside activeTab={activeTab} handleTabClick={handleTabClick} />
        </div>
      </div>
      {mobileopen ? (
        <div className='block xl:hidden lg:hidden md:block 2xl:hidden 4k:hidden'>
          <div>
            <Aside
              activeTab={activeTab}
              handleTabClick={handleTabClick}
              setMobileopen={setMobileopen}
            />
          </div>
        </div>
      ) : (
        <div className='flex-1 min-w-0 max-w-full overflow-hidden pl-4'>
          <div className='hidden xl:block lg:block md:hidden 2xl:block 4k:block 2k:block sticky top-0 bg-white z-[100]'>
            <Header
              activeTab={activeTab}
              setIsBoxOpen={setIsBoxOpen}
              setMobileopen={setMobileopen}
            />
          </div>
          <div className='block xl:hidden lg:hidden md:block 2xl:hidden 4k:hidden 2k:hidden '>
            <Header
              activeTab={activeTab}
              setIsBoxOpen={setIsBoxOpen}
              setMobileopen={setMobileopen}
            />
          </div>
          {activeTab === 'Tab1' && <AnalyseOHS setMobileopen={setMobileopen} />}
          {activeTab === 'Tab2' && (
            <AnalyseHumanRightsCommunityImpact setMobileopen={setMobileopen} />
          )}
          {activeTab === 'Tab3' && (
            <AnalyseCollectiveBargaining setMobileopen={setMobileopen} />
          )}
          {activeTab === 'Tab4' && (
            <AnalyseChildlabour setMobileopen={setMobileopen} />
          )}
          {activeTab === 'Tab5' && (
            <AnalyseEmployment setMobileopen={setMobileopen} />
          )}
          {activeTab === 'Tab6' && (
            <AnalyseTraining setMobileopen={setMobileopen} />
          )}
          {activeTab === 'Tab7' && (
            <AnalyseCustomerprivacy setMobileopen={setMobileopen} />
          )}
          {activeTab === 'Tab8' && (
            <AnalyseCustomerHealthSafety setMobileopen={setMobileopen} />
          )}
          {activeTab === 'Tab9' && (
            <AnalyseMarketingLabeling setMobileopen={setMobileopen} />
          )}
          {activeTab === 'Tab10' && (
            <AnalyseSuppliersocialassessment setMobileopen={setMobileopen} />
          )}
          {activeTab === 'Tab11' && (
            <AnalyseDiversityInclusion setMobileopen={setMobileopen} />
          )}
          {activeTab === 'Tab12' && (
            <AnalyseNonDiscrimination setMobileopen={setMobileopen} />
          )}
        </div>
      )}
    </div>
  );
};

export default social;
