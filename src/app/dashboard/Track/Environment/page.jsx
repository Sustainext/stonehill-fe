'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GiPublicSpeaker } from 'react-icons/gi';
import { MdRefresh } from 'react-icons/md';
import axiosInstance from '../../../utils/axiosMiddleware';
import dynamic from 'next/dynamic';
import { loadFromLocalStorage } from '@/app/utils/storage';

const PowerBIEmbed = dynamic(
  () => import('powerbi-client-react').then((mod) => mod.PowerBIEmbed),
  { ssr: false }
);

const EnvironmentTrack = ({ dashboardData }) => {
  const [activeTab, setActiveTab] = useState('powerbiEmissions');
  const [powerBIToken, setPowerBIToken] = useState(null);
  const [models, setModels] = useState(null);
  const iframeRef = useRef(null);
  const [countdown, setCountdown] = useState(90);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [supersetUrl, setSupersetUrl] = useState('');
  const [userID, setUserID] = useState(null);

  // Load user ID from local storage
  useEffect(() => {
    const id = loadFromLocalStorage('user_id');
    if (id) {
      setUserID(id);
    }
  }, []);

  const POWERBI_REFRESH_INTERVAL = 15000;
  const SUPERSET_REFRESH_INTERVAL = 90000;
  const filter = {
    $schema: 'http://powerbi.com/product/schema#basic',
    target: {
      table: 'Org_Info',
      column: 'Custom User ID',
    },
    operator: 'In',
    values: [userID],
  };


  const tabs = [
    { id: 'zohoEmissions', label: 'Emissions (Zoho)' },
    { id: 'powerbiEmissions', label: 'Emissions (PowerBI)' },
    { id: 'powerbiEnergy', label: 'Energy (PowerBI)' },
    { id: 'powerbiWaste', label: 'Waste (PowerBI)' },
    { id: 'powerbiMaterials', label: 'Materials (PowerBI)' },
    { id: 'powerbiWater', label: 'Water & Effluents (PowerBI)' },
  ];

  useEffect(() => {
    const loadModels = async () => {
      const powerbiClient = await import('powerbi-client');
      setModels(powerbiClient.models);
    };

    loadModels();
  }, []);

  useEffect(() => {
    const fetchPowerBIToken = async () => {
      try {
        const response = await axiosInstance('api/auth/powerbi_token/');
        const data = response.data;
        setPowerBIToken(data.access_token);
      } catch (error) {
        console.error('Error fetching PowerBI token:', error);
      }
    };

    fetchPowerBIToken();
  }, []);

  const getIframeUrl = useCallback((tabId) => {
    switch (tabId) {
      case 'zohoEmissions':
        return process.env.NEXT_APP_ZOHO_URL_EMISSIONS;
      case 'superSetEmissions':
        return process.env.NEXT_APP_SUPERSET_URL_ENV_EMISSIONS;
      case 'superSetWaste':
        return process.env.NEXT_APP_SUPERSET_URL_ENV_WASTE;
      default:
        return null;
    }
  }, []);

  useEffect(() => {
    if (activeTab.startsWith('superSet')) {
      const url = getIframeUrl(activeTab);
      setSupersetUrl(url);
    }
  }, [activeTab, getIframeUrl]);

  const getPowerBIConfig = (tabId) => {
    if (!dashboardData) return null;

    let reportConfig;
    switch (tabId) {
      case 'powerbiEmissions':
        reportConfig = dashboardData.find((item) => item.emission)?.emission;
        break;
      case 'powerbiEnergy':
        reportConfig = dashboardData.find((item) => item.energy)?.energy;
        break;
      case 'powerbiWaste':
        reportConfig = dashboardData.find((item) => item.waste)?.waste;
        break;
      case 'powerbiMaterials':
        reportConfig = dashboardData.find((item) => item.material)?.material;
        break;
      case 'powerbiWater':
        reportConfig = dashboardData.find(
          (item) => item.water_and_effluents
        )?.water_and_effluents;
        break;
      default:
        return null;
    }

    if (!reportConfig) return null;

    return {
      type: 'report',
      id: reportConfig.report_id,
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportConfig.report_id}&groupId=${reportConfig.group_id}&w=2`,
      accessToken: powerBIToken,
      tokenType: models.TokenType.Aad,
      filters: [filter],
      settings: {
        panes: {
          filters: {
            expanded: false,
            visible: false,
          },
        },
        background: models.BackgroundType.Default,
      },
    };
  };

  const refreshDashboard = useCallback(async () => {
    setIsRefreshing(true);
    if (activeTab.startsWith('powerbi') && window.report) {
      try {
        await window.report.refresh();
        console.log('PowerBI report refreshed');
      } catch (errors) {
        console.log(errors);
      }
    } else if (activeTab.startsWith('superSet') && iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = supersetUrl;
      }, 100);
      console.log('Superset dashboard refresh triggered');
      setCountdown(90);
    }
    setIsRefreshing(false);
  }, [activeTab, supersetUrl]);

  useEffect(() => {
    let intervalId;
    if (activeTab.startsWith('powerbi')) {
      intervalId = setInterval(refreshDashboard, POWERBI_REFRESH_INTERVAL);
    } else if (activeTab.startsWith('superSet')) {
      intervalId = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            refreshDashboard();
            return 90;
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [activeTab, refreshDashboard]);

  if (!models || !PowerBIEmbed || !dashboardData) return <p>Loading...</p>;
  if (dashboardData.length === 0) return <p>Data not available</p>;

  return (
    <div className='flex flex-col justify-start items-center w-full max-h-[80vh] max-w-full min-h-screen p-4 overflow-auto'>
      <div className='w-full border-b border-gray-200 flex justify-between items-center'>
        <ul className='flex flex-wrap text-sm font-medium text-center text-gray-500'>
          {tabs.map((tab) => (
            <li className='mr-2' key={tab.id}>
              <button
                className={`inline-block p-4 rounded-t-lg ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        {activeTab.startsWith('superSet') && (
          <div className='flex items-center'>
            <span className='mr-2'>Refresh in: {countdown}s</span>
            <button
              onClick={refreshDashboard}
              disabled={isRefreshing}
              className={`p-2 rounded ${
                isRefreshing ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              <MdRefresh
                className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        )}
      </div>
      <div className='w-full flex justify-center'>
        {activeTab.startsWith('powerbi') && powerBIToken ? (
          <div className='w-full scrollable-content h-[80vh] max-w-full overflow-hidden'>
            <PowerBIEmbed
              embedConfig={getPowerBIConfig(activeTab)}
              eventHandlers={
                new Map([
                  ['loaded', () => console.log('Report loaded')],
                  ['rendered', () => console.log('Report rendered')],
                  ['error', (event) => console.log(event.detail)],
                  ['visualClicked', () => console.log('visual clicked')],
                  ['pageChanged', (event) => console.log(event)],
                ])
              }
              cssClassName='w-full h-full'
              getEmbeddedComponent={(embeddedReport) => {
                window.report = embeddedReport;
              }}
            />
          </div>
        ) : activeTab.startsWith('superSet') ? (
          <iframe
            ref={iframeRef}
            frameBorder='0'
            className='w-full  h-[70vh] max-w-full'
            src={supersetUrl}
          ></iframe>
        ) : getIframeUrl(activeTab) ? (
          <iframe
            frameBorder='0'
            className='w-full  h-[70vh] max-w-full'
            src={getIframeUrl(activeTab)}
          ></iframe>
        ) : (
          <div className='coming-soon-container'>
            <div className='flex justify-center'>
              <GiPublicSpeaker style={{ fontSize: '100px' }} />
            </div>
            <div className='text-xl font-bold my-4'>
              <span>Loading... </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvironmentTrack;