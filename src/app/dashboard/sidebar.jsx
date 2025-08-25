import React, { useState, useEffect } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardArrowDown,
  MdOutlineAddBox,
  MdPublic,
  MdOutlineGroup,
  MdOutlineDiversity1,
  MdOutlineDiversity2,
  MdOutlineDiversity3,
  MdOutlinePieChartOutline,
  MdOutlineBarChart,
  MdOutlineSettingsSuggest,
  MdOutlineSearch,
  MdOutlineAccountTree,
  MdInfoOutline,
  MdEditNote,
  MdOutlineManageAccounts,
  MdOutlinePersonAddAlt,
  MdLockOutline,
} from "react-icons/md";
import { TbNotes,TbPlugConnected } from "react-icons/tb";
import { LiaHomeSolid } from "react-icons/lia";
import Link from "next/link";
import { GlobalState } from "../../Context/page";
import { CiSettings } from "react-icons/ci";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineAssignment } from "react-icons/md";
import { MdMenuBook } from "react-icons/md";
import {
  fetchMaterialityData,
  setCorpID,
  setCorpName,
  setMaterialityYear,
  setOrgName,
  setOrgID,
  setStartDate,
  setEndDate,
  setIsYearChanged,
} from "../../lib/redux/features/materialitySlice";

const Sidenav = () => {
  const { open, setOpen } = GlobalState();
  const [activeIndex, setActiveIndex] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [newrole, setRole] = useState(""); // Ensure role is initialized
  const dispatch = useDispatch();
  const {
    corporate_id,
    organization_id,
    start_date,
    end_date,
    data,
    loading,
    error,
    materiality_year,
  } = useSelector((state) => state.materialitySlice);

  const loadMaterialityDashboard = () => {
    dispatch(
      fetchMaterialityData({
        corporate: corporate_id ? corporate_id : "",
        organization: organization_id ? organization_id : "",
        start_date: materiality_year ? `${materiality_year}-01-01` : "",
        end_date: materiality_year ? `${materiality_year}-12-31` : "",
      })
    );
  };

  // Load permissions and role from localStorage or API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPermissions = localStorage.getItem("permissions");
      const storedRole = localStorage.getItem("custom_role"); // Fetch the role
      if (storedPermissions) {
        try {
          setPermissions(JSON.parse(storedPermissions));
        } catch (error) {
          console.error("Failed to parse stored permissions:", error);
          setPermissions({}); // Fallback to an empty object if parsing fails
        }
      } else {
        setPermissions({}); // Set permissions to empty object if not available
      }

      if (storedRole) {
        setRole(storedRole); // Get role from localStorage
        console.log("Stored role:", storedRole);
      }
    }
  }, []);
  const isNewRole = newrole === "true";

  const Menus = [
    {
      id: 0,
      title: "Sustainext HQ",
      icon: <LiaHomeSolid />,
      link: "/dashboard",
        spacing: true,
      lockicon: <MdLockOutline />,
      lockiconshow: false,
    },
    // {
    //   id: 1,
    //   title: "Materiality Dashboard",
    //   icon: <MdOutlinePieChartOutline />,
    //   spacing: false,
    //   link: "/dashboard/Materiality",
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    // },
    // {
    //   id: 2,
    //   title: "Supplier Assessment",
    //   icon: <MdOutlineAssignment />,
    //   link: "/dashboard/SupplierAssessment",
    //   spacing: true,
    //   // permission: "supplier",
    //   // role: false,
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    // },
    {
      id: 3,
      title: "Collect",
      icon: <MdOutlineAddBox />,
      submenu: true,
      permission: "collect",
      role: true,
      lockicon: <MdLockOutline />,
      lockiconshow: false,

      submenuItems: [
        {
          id: "2-1",
          title: "Environment",
          icon: <MdPublic />,
          link: "/dashboard/environment",
        },
        // {
        //   id: "2-2",
        //   title: "Social",
        //   icon: <MdOutlineGroup />,
        //   link: "/dashboard/social",
        // },
        // {
        //   id: "2-3",
        //   title: "Governance",
        //   icon: <MdOutlineDiversity1 />,
        //   link: "/dashboard/governance",
        // },
        // {
        //   id: "2-4",
        //   title: "General",
        //   icon: <MdOutlineDiversity2 />,
        //   link: "/dashboard/general",
        // },
        // {
        //   id: "2-5",
        //   title: "Economic",
        //   icon: <MdOutlineDiversity3 />,
        //   link: "/dashboard/economic",
        // },
      ],
    },
    {
      id: 4,
      title: "Analyse",
      icon: <MdOutlineBarChart />,
      submenu: true,
      permission: "analyse",
      role: true,
      lockicon: <MdLockOutline />,
      lockiconshow: false,

      submenuItems: [
        {
          id: "3-1",
          title: "Environment",
          icon: <MdPublic />,
          link: "/dashboard/Analyse/environment",
        },
        // {
        //   id: "3-2",
        //   title: "Social",
        //   icon: <MdOutlineGroup />,
        //   link: "/dashboard/Analyse/social",
        // },
        // {
        //   id: "3-3",
        //   title: "Governance",
        //   icon: <MdOutlineDiversity1 />,
        //   link: "/dashboard/Analyse/governance",
        // },
        // {
        //   id: "3-4",
        //   title: "General",
        //   icon: <MdOutlineDiversity2 />,
        //   link: "/dashboard/Analyse/general",
        // },
        // {
        //   id: "3-5",
        //   title: "Economic",
        //   icon: <MdOutlineDiversity3 />,
        //   link: "/dashboard/Analyse/economic",
        // },
      ],
    },
    {
      id: 5,
      title: "Report",
      icon: <MdEditNote />,
      link: "/dashboard/Report",
      permission: "report",
      role: true,
      lockicon: <MdLockOutline />,
      lockiconshow: false,
    },
    {
      id: 6,
      title: "Optimise",
      icon: <MdOutlineSettingsSuggest />,
      link: "/dashboard/Optimise",
      permission: "optimise",
      role: true,
      lockicon: <MdLockOutline />,
      lockiconshow: true,
    },
    {
      id: 7,
      title: "Track",
      icon: <MdOutlineSearch />,
      spacing: true,
      role: true,
      link: "/dashboard/Track",
      permission: "track",
      lockicon: <MdLockOutline />,
      lockiconshow: false,
    },

    isNewRole && {
      id: 8,
      title: "Users",
      icon: <MdOutlineGroup />,
      submenu: true,
      role: true,
      submenuItems: [
        {
          id: "7-1",
          title: "Create new user",
          icon: <MdOutlinePersonAddAlt />,
          link: "/dashboard/Users/create-new-users",
        },
        {
          id: "7-2",
          title: "Manage Users",
          icon: <MdOutlineManageAccounts />,
          link: "/dashboard/Users/manage-users",
        },
      ],
    },

    {
      id: 9,
      title: "Organizational Structure",
      icon: <MdOutlineAccountTree />,
      link: "/dashboard/OrgStructure",
      role: true,
      lockicon: <MdLockOutline />,
      lockiconshow: false,
      spacing: false,
    },
    // {
    //   id: 10,
    //   title: "Connect My Data",
    //   icon: <TbPlugConnected />,
    //   link: "/dashboard/ConnectData",
    //   role: true,
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    //   spacing: true,
    // },
    // {
    //   id: 10,
    //   title: "Resource Library",
    //   icon: <MdMenuBook />,
    //   link: "/dashboard/ResourceLibrary",
    //   role: true,
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    // },
    // isNewRole && {
    //   id: 11,
    //   title: "Audit logs",
    //   icon: <TbNotes />,
    //   link: "/dashboard/Auditlogs",
    //   role: true,
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    // },
    // {
    //   id: 12,
    //   title: "Settings",
    //   icon: <CiSettings />,
    //   link: "/dashboard/Settings",
    //   role: true,
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    // },
    // {
    //   id: 10,
    //   title: "About",
    //   icon: <MdInfoOutline />,
    //   link: "#",
    //   role: true,
    //   lockicon: <MdLockOutline />,
    //   lockiconshow: false,
    // },
  ].filter(Boolean); // Remove false values (if the "Users" menu is not rendered)

  const [submenuOpen, setSubmenuOpen] = useState(
    new Array(Menus.length).fill(false)
  );

  const toggleSubmenu = (index) => {
    const newSubmenuOpen = submenuOpen.map((item, i) =>
      i === index ? !item : false
    );
    setSubmenuOpen(newSubmenuOpen);
  };

  const isSubmenuActive = (menu) => {
    return menu.submenuItems?.some(
      (submenuItem) => submenuItem.id === activeIndex
    );
  };

  const hasPermission = (menu) => {
    if (!menu.permission) return true; // No permission needed
    return permissions[menu.permission] === true; // Allow if permission is granted
  };

  return (
    <>
      <div className="overflow-hidden">
        <div
          className={`bg-[#0a0528] pt-[1.25rem] pb-11 ${
            open ? "w-[15rem]" : "w-[4.5rem]"
          } duration-300 relative`}
        >
          <div className="flex justify-center">
            <div className={`flex ${open ? "me-10" : "-me-[7rem]"}`}>
              <img src="/download.png" alt="Logo" className="h-10 w-auto" />
              <h1 className={`text-white text-2xl pt-1 ${!open && "scale-0"}`}>
                Sustainext
              </h1>
            </div>
            <div>
              <MdKeyboardDoubleArrowLeft
                className={`text-[#fff] text-2xl absolute cursor-pointer transition-transform duration-300 ${
                  !open ? "rotate-180 right-0 top-7" : "right-0 top-7"
                }`}
                onClick={() => setOpen(!open)}
              />
            </div>
          </div>
          <ul className="pt-2 overflow-y-scroll h-[110vh] scrollable-content">
            {Menus.filter(hasPermission).map((menu, index) => (
              <React.Fragment key={menu.id}>
                {menu.submenu ? (
                  <li
                    className={`text-white text-sm flex items-center hover:bg-[#007EEF] gap-x-4 cursor-pointer rounded-md mt-2 w-full p-2
          ${submenuOpen[index] || isSubmenuActive(menu) ? "bg-[#081746]" : ""}
          ${!open && activeIndex === menu.id ? "bg-[#081746]" : ""}`}
                    onClick={() => {
                      toggleSubmenu(index);
                      setActiveIndex(menu.id);
                      if (menu.title === "Collect") {
                        loadMaterialityDashboard();
                      } else {
                        dispatch(setCorpID(""));
                        dispatch(setCorpName(""));
                        dispatch(setOrgID(""));
                        dispatch(setOrgName(""));
                        dispatch(setMaterialityYear(""));
                        dispatch(setStartDate(""));
                        dispatch(setEndDate(""));
                        dispatch(setIsYearChanged(false));
                      }
                    }}
                  >
                    <span
                      className={`text-2xl flex items-center justify-center w-12 h-8 rounded-md ${
                        !open ? "hover:bg-[#007EEF]" : ""
                      }
          ${
            !open && (activeIndex === menu.id || isSubmenuActive(menu))
              ? "bg-[#081746]"
              : ""
          }`}
                      data-tooltip-id={`tooltip-${index}`}
                      data-tooltip-content={menu.title}
                      onClick={() => setOpen(!open)}
                    >
                      {menu.icon ? menu.icon : <LiaHomeSolid />}
                    </span>
                    <span
                      className={`text-sm font-medium flex-1 ${
                        !open && "hidden"
                      }`}
                    >
                      {menu.title}
                    </span>
                    {menu.submenu && open && (
                      <MdKeyboardArrowDown
                        className={`text-2xl ${
                          submenuOpen[index] ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    {!open && (
                      <ReactTooltip
                        id={`tooltip-${index}`}
                        place="right"
                        effect="solid"
                        style={{
                          fontSize: "10px",
                          background: "#0a0528",
                          boxShadow: 3,
                          borderRadius: "8px",
                          zIndex: 1000,
                        }}
                      />
                    )}
                  </li>
                ) : (
                  <Link href={menu.link} key={menu.id}>
                    <li
                      className={`text-white text-sm flex items-center gap-x-4 cursor-pointer rounded-md mt-2 w-full p-2
            ${open ? "hover:bg-[#007EEF]" : ""} ${
                        open && activeIndex === menu.id ? "bg-[#081746]" : ""
                      } ${
                        !open && activeIndex === menu.id ? "bg-[#081746]" : ""
                      }`}
                      onClick={() => {
                        setActiveIndex(menu.id);
                        setOpen(!open);

                        // Check if the clicked menu is "Collect" and call loadMaterialityDashboard
                        if (menu.title === "Collect") {
                          loadMaterialityDashboard();
                        } else {
                          dispatch(setCorpID(""));
                          dispatch(setCorpName(""));
                          dispatch(setOrgID(""));
                          dispatch(setOrgName(""));
                          dispatch(setMaterialityYear(""));
                          dispatch(setStartDate(""));
                          dispatch(setEndDate(""));
                          dispatch(setIsYearChanged(false));
                        }
                      }}
                    >
                      <span
                        className={`text-2xl flex items-center justify-center w-12 h-8 rounded-md ${
                          !open ? "hover:bg-[#007EEF]" : ""
                        }
              ${!open && activeIndex === menu.id ? "bg-[#081746]" : ""}`}
                        data-tooltip-id={`tooltip-${index}`}
                        data-tooltip-content={menu.title}
                      >
                        {menu.icon ? menu.icon : <LiaHomeSolid />}
                      </span>
                      <span
                        className={`text-sm font-medium flex-1 ${
                          !open && "hidden"
                        }`}
                      >
                        {menu.title}
                      </span>

                      {menu.lockiconshow && open && (
                        <span className="text-2xl flex items-center justify-center w-5 h-8 rounded-md">
                          {menu.lockicon}
                        </span>
                      )}
                      {!open && (
                        <ReactTooltip
                          id={`tooltip-${index}`}
                          place="right"
                          effect="solid"
                          style={{
                            fontSize: "10px",
                            background: "#0a0528",
                            boxShadow: 3,
                            borderRadius: "8px",
                            zIndex: 1000,
                          }}
                        />
                      )}
                    </li>
                  </Link>
                )}
                {menu.spacing && (
                  <hr className="bg-[rgba(217, 217, 217, 1)] h-[0.0625rem] my-4 mx-3 opacity-30" />
                )}
                {menu.submenu && submenuOpen[index] && open && (
                  <ul>
                    {menu.submenuItems.map((submenuItem) => (
                      <Link href={submenuItem.link} key={submenuItem.id}>
                        <li
                          className={`text-white text-sm p-2 px-5 mx-5 flex items-center gap-x-4 cursor-pointer hover:bg-[#007EEF] rounded-md  mt-2 ${
                            activeIndex === submenuItem.id ? "bg-[#081746]" : ""
                          }`}
                          onClick={() => {
                            setActiveIndex(submenuItem.id);
                            setOpen(!open);

                            // if (submenuItem.title === "Environment") {
                            //   loadMaterialityDashboard();
                            // }
                            // else{
                            //   dispatch(setCorpID(''))
                            //   dispatch(setCorpName(''))
                            //   dispatch(setOrgID(''))
                            //   dispatch(setOrgName(''))
                            //   dispatch(setMaterialityYear(''))
                            //   dispatch(setStartDate(''))
                            //   dispatch(setEndDate(''))
                            // }
                          }}
                        >
                          <span className="text-2xl block float-left">
                            {submenuItem.icon ? (
                              submenuItem.icon
                            ) : (
                              <LiaHomeSolid />
                            )}
                          </span>
                          <span
                            className={`text-sm font-medium flex-1 ${
                              !open && "hidden"
                            }`}
                          >
                            {submenuItem.title}
                          </span>
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidenav;
