'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../Context/auth';
import { useRouter } from 'next/navigation';
import { loadFromLocalStorage } from '../utils/storage';
import Link from 'next/link';
import Profile from './Profile';
import { Oval } from 'react-loader-spinner';
import { GlobalState } from '../../Context/page';
import { FaUser } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { MdOutlineLocalPhone, MdEdit } from 'react-icons/md';
import { IoSettingsOutline } from 'react-icons/io5';
import { BiSupport } from 'react-icons/bi';
import LogoutPopup from '../shared/components/logoutModal';
import SettingPanel from './settingPanel';
import axiosInstance, { patch } from '../utils/axiosMiddleware';
import { MdOutlineLanguage } from 'react-icons/md';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { MaskedEmail, MaskedPhone } from '../shared/components/MaskedPIIField';
import 'react-tooltip/dist/react-tooltip.css';
import { CiBellOn } from 'react-icons/ci';
import NotificationsModal from '../shared/components/NotificationsModal';
import { motion } from 'framer-motion';

const DashboardHeader = () => {
  const { open } = GlobalState();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [refresh, setRefresh] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const bellIconRef = useRef(null);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    initials: '',
    first_name: '',
    last_name: '',
  });
  const { logout, userDetails } = useAuth();
  const router = useRouter();
  const profileRef = useRef(null);
  const drawerRef = useRef(null);
  // Redux selectors
  const text1 = useSelector((state) => state.header.headertext1);
  const text2 = useSelector((state) => state.header.headertext2);
  const headerdisplay = useSelector((state) => state.header.headerdisplay);
  const middlename = useSelector((state) => state.header.middlename);
  const [userProfileData, setUserProfileData] = useState({
    firstname: '',
    lastname: '',
    department: '',
    designation: '',
    jobDescription: '',
    role: '',
    phone: '',
  });

  // const id = parseInt(localStorage.getItem("user_id") || "0");

  useEffect(() => {
    const user_id = parseInt(localStorage.getItem('user_id') || '0');
    const fetchUserDetails = async () => {
      // setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/auth/user_profile/`);
        if (response.status == 200) {
          const data = response.data;
          setUserProfileData({
            firstname: data.first_name,
            lastname: data.last_name,
            department: data.department,
            designation: data.designation,
            jobDescription: data.job_description,
            role: data.custom_role,
            phone: data.phone,
            profile_pic: data.profile_pic,
          });
        }
      } catch (error) {
        // setIsModalOpen(true);
        console.error('Error fetching user details:', error);
        if (error.redirectToLogin) {
          router.push('/login');
        }
      }
      // setLoading(false);
    };
    fetchUserDetails();
  }, [refresh]);

  const getInitials = (email) => {
    // extract first letter from first name and last name, if they are empty the split the username and take the first letter
    const firstName = userDetails?.user_detail[0]?.first_name || '';
    const lastName = userDetails?.user_detail[0]?.last_name || '';
    const username = userDetails?.user_detail[0]?.username || '';
    const initials = firstName.charAt(0) + lastName.charAt(0);
    const usernameInitials = username.charAt(0);
    return initials || usernameInitials;
  };

  function capitalizeName(name) {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  // Combined effect for initializing user data
  useEffect(() => {
    const initializeUserData = () => {
      // First try to get data from Auth context
      if (userDetails?.user_detail?.[0]) {
        const email = userDetails.user_detail[0].email;
        const first_name = userDetails.user_detail[0].first_name;
        const last_name = userDetails.user_detail[0].last_name;
        const username = userDetails?.user_detail[0]?.username || '';
        const initials = first_name.charAt(0) + last_name.charAt(0);
        const usernameInitials = username.charAt(0);
        setUserData({
          username: userDetails.user_detail[0].username,
          email: email,
          initials: initials || usernameInitials,
          last_name: capitalizeName(last_name),
          first_name: capitalizeName(first_name),
        });
        return;
      }

      // Fallback to localStorage if context is empty
      const localUserDetails = loadFromLocalStorage('userData');
      if (localUserDetails?.user_detail?.[0]) {
        const email = localUserDetails?.user_detail[0]?.username;
        const first_name = localUserDetails.user_detail[0].first_name;
        const last_name = localUserDetails.user_detail[0].last_name;
        const username = localUserDetails?.user_detail[0]?.username || '';
        const initials = first_name.charAt(0) + last_name.charAt(0);
        const usernameInitials = username.charAt(0);
        setUserData({
          username: localUserDetails?.user_detail[0]?.username,
          email: email,
          initials: initials || usernameInitials,
          initials: initials || usernameInitials,
        });
      }
    };

    initializeUserData();

    // Set up interval to check for user data
    const interval = setInterval(() => {
      if (!userData.username) {
        initializeUserData();
      }
    }, 1000);

    // Cleanup interval
    return () => clearInterval(interval);
  }, [userDetails, refresh]); // Depend on userDetails from context

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setActiveTab('profile');
    setProfileVisible(true);
    setDropdownVisible(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // FluentC widget observer
  const [opens, setOpen] = useState(false);
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.matches('._fluentc_widget-language-manager.show')
            ) {
              node.classList.remove('show');
            }
          });
        }

        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const target = mutation.target;
          if (
            target === document.body &&
            target.classList.contains('_fluentc_widget-banner-show')
          ) {
            target.classList.remove('_fluentc_widget-banner-show');
            const widgetDiv = document.querySelector(
              '._fluentc_widget-language-manager.show'
            );
            widgetDiv?.classList.remove('show');
          }

          if (target.matches('._fluentc_widget-language-manager')) {
            setOpen(target.classList.contains('loading'));
          }
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDropdownVisible(false); // Close drawer when clicking outside
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className='flex bg-white xl:sticky lg:sticky 2xl:sticky md:sticky xl:top-0 lg:top-0 2xl:top-0 md:top-0 right-0 border-b border-sky-600 border-opacity-50 xl:pt-4 lg:pt-4 md:pt-4 2xl:pt-4 w-full xl:z-[50] lg:z-[50] md:z-[50] 2xl:z-[50] min-w-0'>
        <div className='flex justify-start items-center my-2 gap-1 flex-1 min-w-0 px-6'>
          <Link href='/dashboard'>
            <span className='text-[#007EEF] hover:text-[#007EEF] font-semibold'>
              Home
            </span>
          </Link>
          <span className='text-[#222222] mx-1'>&gt;</span>

          {text1 !== '' && (
            <>
              <span className='text-[#222222] hover:text-[#222222]'>
                {text1}
              </span>
              <span className='text-[#222222] mx-1'>&gt;</span>
            </>
          )}

          {headerdisplay === 'block' && (
            <>
              <span className='text-[#222222] hover:text-[#222222]'>
                {middlename}
              </span>
              <span className='text-[#222222] mx-1'>&gt;</span>
            </>
          )}

          <span className='text-[#222222] hover:text-[#222222]'>{text2}</span>
        </div>
        <div className='lg:block xl:block 2xl:block md:block hidden flex-shrink-0 mr-6'>
          <div className='flex justify-end items-center  '>
            <div className='flex justify-between items-center'>
              <div className='text-[#007EEF] flex relative items-center whitespace-nowrap'>
                <span className='text-[#007EEF] me-1'>Hi,</span>
                <span
                  title={
                    userProfileData?.firstname
                      ? `${userProfileData.firstname} ${userProfileData.lastname}`
                      : userData?.username
                  }
                  className='truncate max-w-[200px] overflow-hidden inline-block'
                >
                  {userProfileData?.firstname
                    ? `${userProfileData.firstname} ${userProfileData.lastname}`
                    : userData?.username}
                </span>
                {/* <ReactTooltip
                    id={`tooltip-$e1`}
                    place="top"
                    effect="solid"
                    style={{
                      width: "fit-content",
                      backgroundColor: "#000",
                      color: "white",
                      fontSize: "12px",
                      boxShadow: 3,
                      borderRadius: "8px",
                      textAlign: "left",
                    }}
                  ></ReactTooltip> */}
              </div>

              {/* <div
                ref={bellIconRef}
                className='flex items-center mx-3 rounded-md hover:bg-gray-100 hover:shadow-sm p-1 cursor-pointer transition-all duration-200'
                onClick={() => {
                  console.log('Notification clicked!');
                  setNotificationsVisible(!notificationsVisible);
                }}
              >
                <div className='relative'>
                  <CiBellOn style={{ fontSize: '22px' }} />
                  <span className='absolute -top-1 -right-1 bg-gradient-to-r from-sky-500 to-lime-500 text-white text-xs px-1 rounded-full'>
                    2
                  </span>
                </div>
              </div> */}

              <div
                className='relative cursor-pointer flex-shrink-0 ml-4'
                onClick={() => {
                  console.log('Profile clicked!');
                  toggleDropdown();
                }}
              >
                <div className='flex justify-center items-center'>
                  {userProfileData?.profile_pic ? (
                    <div className=' w-[30px] h-[30px] flex justify-center items-center overflow-hidden'>
                      <img
                        src={userProfileData.profile_pic}
                        alt='Profile'
                        className='w-full h-full rounded-full object-cover border border-gray-300'
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        background:
                          'linear-gradient(rgb(0, 126, 239), rgb(42, 228, 255))',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {userData.initials}
                    </div>
                  )}

                  <div>
                    <svg
                      className='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv'
                      focusable='false'
                      aria-hidden='true'
                      viewBox='0 0 24 24'
                      data-testid='ArrowDropDownOutlinedIcon'
                    >
                      <path d='m7 10 5 5 5-5H7z'></path>
                    </svg>
                  </div>
                </div>
                {dropdownVisible && (
                  // <div
                  //   ref={drawerRef}
                  //   className="w-[220px] absolute -right-[2px] mt-3 bg-white border border-gray-300 rounded shadow-lg"
                  //   onMouseEnter={() => setDropdownVisible(true)} // Prevent closing when mouse enters dropdown
                  // >
                  //   <div className="self-stretch bg-white rounded shadow flex-col justify-start items-start flex">
                  //     <div className="self-stretch h-[45px] flex-col justify-start items-start flex">
                  //       <div className="self-stretch px-4 py-1 justify-start items-center inline-flex border-b-2 border-gray-300">
                  //         <div className="grow shrink basis-0 py-1 flex-col justify-start items-start inline-flex">
                  //           <div className="self-stretch text-black/opacity-90 text-[13px] font-normal font-['Manrope'] leading-none">
                  //             {userData.username}
                  //           </div>
                  //           <div className="self-stretch text-black/opacity-60 text-xs font-normal font-['Manrope'] leading-[15px]">
                  //             {userData.email}
                  //           </div>
                  //         </div>
                  //       </div>
                  //     </div>
                  //     <div className="self-stretch py-1 flex-col justify-start items-start flex">
                  //       <div
                  //         className="self-stretch px-4 py-2 justify-start items-center inline-flex border-b-2 border-gray-300"
                  //         onClick={handleProfileClick}
                  //       >
                  //         <div className="grow shrink basis-0 text-black/opacity-90 text-[13px] font-normal font-['Manrope'] leading-none cursor-pointer flex">
                  //           <div>
                  //             <FaUser />
                  //           </div>
                  //           <div className="ml-2">Profile</div>
                  //         </div>
                  //       </div>
                  //       <div
                  //         className="self-stretch px-4 py-2 justify-start items-center inline-flex"
                  //         onClick={handleLogout}
                  //       >
                  //         <div className="grow shrink basis-0 text-black/opacity-90 text-[13px] font-normal font-['Manrope'] leading-none cursor-pointer flex text-red-600">
                  //           <div>
                  //             <MdLogout />
                  //           </div>
                  //           <div className="ml-2">Log out</div>
                  //         </div>
                  //       </div>
                  //     </div>
                  //   </div>
                  // </div>
                  <div
                    ref={drawerRef}
                    className='w-auto absolute -right-2 mt-3 bg-white border border-gray-300 rounded-lg shadow-lg'
                    onMouseEnter={() => setDropdownVisible(true)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className='flex flex-col p-3'>
                      {/* User Info */}
                      <div className='flex flex-col p-2 items-start border-b border-gray-200 pb-4'>
                        <div className='flex gap-6 items-center w-full'>
                          <div className='flex-1'>
                            <div className='text-sm font-bold text-gray-900'>
                              {userData.username}
                            </div>
                            <div className='text-sm text-gray-500'>
                              <MaskedEmail
                                email={userData.email}
                                className='inline'
                              />
                            </div>
                          </div>
                          {/* Badge */}
                          <span className='text-[10px] font-semibold text-[#FFA701] bg-orange-100 px-2 py-1 rounded-full'>
                            {userProfileData.role
                              ? userProfileData.role
                              : 'Employee'}
                          </span>
                        </div>
                        {userProfileData?.designation && (
                          <div className='mt-4 text-sm text-gray-700'>
                            {userProfileData.designation}
                            <br />
                            {userProfileData.department}
                          </div>
                        )}
                        {userProfileData?.phone && (
                          <div className='flex items-center text-gray-600 text-sm mt-3'>
                            <MdOutlineLocalPhone className='w-4 h-4 mr-1' />
                            <MaskedPhone
                              phone={userProfileData.phone}
                              className='inline'
                            />
                          </div>
                        )}

                        {/* Edit Profile Button */}
                        <button
                          onClick={handleProfileClick}
                          className='w-full mt-4 mb-2 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:shadow-sm  flex items-center justify-center'
                        >
                          Edit Profile
                          <MdEdit className='ml-2' />
                        </button>
                      </div>

                      {/* Account Settings */}
                      <button
                        onClick={() => {
                          setProfileVisible(true);
                          setDropdownVisible(false);
                          setActiveTab('account');
                        }}
                        className='w-full mt-3 p-2 flex items-center hover:bg-blue-50 hover:rounded-md text-gray-700 text-sm hover:text-gray-900'
                      >
                        <IoSettingsOutline className='w-4 h-4 mr-2' />
                        Account Settings
                      </button>

                      {/* <button
      // onClick={() => {setProfileVisible(true);
      //   setDropdownVisible(false); setActiveTab('account')}}
      className="w-full  p-2 flex items-center hover:bg-blue-50 hover:rounded-md text-gray-700 text-sm hover:text-gray-900"
    >
     <MdOutlineLanguage className="w-4 h-4 mr-2" />
      Language Settings
    </button> */}

                      <div className='border-b pb-4 border-gray-200'>
                        <button
                          disabled={true}
                          onClick={() =>
                            console.log('Account settings clicked')
                          }
                          className='w-full cursor-not-allowed opacity-25 mt-2 px-2 flex  items-center text-gray-700 text-sm hover:text-gray-900'
                        >
                          <BiSupport className='w-4 h-4 mr-2' />
                          Support
                        </button>
                      </div>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          setIsModalOpen(true);
                        }}
                        className='w-full mt-2 p-2 flex items-center hover:bg-blue-50 hover:rounded-md  text-red-600 text-sm'
                      >
                        <MdLogout className='mr-2 w-4 h-4' />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {profileVisible && (
        <div
          ref={profileRef}
          className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
        >
          {/* <Profile onClose={() => setProfileVisible(false)} /> */}
          <SettingPanel
            setRefresh={setRefresh}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setProfileVisible={setProfileVisible}
            userProfileData={userProfileData}
            email={userData.email}
          />
        </div>
      )}
      {opens && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <Oval
            height={50}
            width={50}
            color='#00BFFF'
            secondaryColor='#f3f3f3'
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}

      <LogoutPopup
        handleLogout={handleLogout}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      {/* <NotificationsModal
        isOpen={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      /> */}
    </>
  );
};

export default DashboardHeader;