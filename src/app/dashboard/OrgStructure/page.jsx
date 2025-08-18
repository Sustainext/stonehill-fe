'use client';
import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/app/utils/axiosMiddleware';
import { FaPlus } from 'react-icons/fa';
import QuickAddModal from './QuickAddModal';
import NodeDetailModal from './NodeDetailModal';
import Link from 'next/link';
import {
  setHeadertext1,
  setHeadertext2,
  setHeaderdisplay,
  setMiddlename,
} from '../../../lib/redux/features/topheaderSlice';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrgTreeMobile from './OrgTreeMobile';

const OrgTree = ({ data }) => {
  // Responsive container width
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  useEffect(() => {
    function updateSize() {
      if (containerRef.current)
        setContainerWidth(containerRef.current.offsetWidth);
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  // Responsive layout
  const totalLevels = 3;
  const nodeWidth = Math.min(
    200,
    Math.max(120, Math.floor(containerWidth / (totalLevels * 1.2)))
  );
  const nodeHeight = 60;
  const levelGap = Math.min(
    120,
    Math.max(
      40,
      Math.floor((containerWidth - totalLevels * nodeWidth) / (totalLevels - 1))
    )
  );
  const siblingGap = 40;
  const [expandedLocations, setExpandedLocations] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axiosInstance.get('/api/auth/get_user_roles/');
        if (response.status === 200) {
          const data = await response.data;
          setIsAdmin(data.admin);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  // --- Data transformation, layout, helpers ---
  const transformData = (apiData) => {
    if (!apiData || apiData.length === 0) return null;
    const organizations = apiData.map((org) => ({
      id: org.id,
      name: org.name,
      type: 'organization',
      info: `${org.sector || ''}, ${org.countryoperation || ''}`,
      children: org.corporatenetityorg?.filter(Boolean).map((entity) => ({
        id: entity.id,
        name: entity.name,
        parentOrgId: org.id,
        type: 'corporate',
        info: `${entity.sector || ''}, ${entity.Country || ''}`,
        locationCount: entity.location?.length || 0,
        children: entity.location?.filter(Boolean).map((loc) => ({
          id: loc.id,
          name: loc.name,
          parentCorpId: entity.id,
          type: 'location',
          info: `${loc.typelocation || 'Head office'}`,
        })),
      })),
    }));
    return organizations;
  };
  const transformedData = transformData(data);

  const calculateLayout = (nodes, level = 0, startY = 0) => {
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) return [];
    let results = [];
    let currentY = startY;
    nodes.forEach((node, index) => {
      if (!node) return;
      if (index > 0) currentY += siblingGap;
      const x = level * (nodeWidth + levelGap);
      const y = currentY;
      results.push({ ...node, x, y, width: nodeWidth, height: nodeHeight });
      if (node.type !== 'location' && node.children?.length > 0) {
        if (node.type === 'corporate') {
          results.push({
            id: `${node.id}-locations`,
            name: `${node.locationCount} Locations`,
            type: 'location-header',
            parentId: node.id,
            x: x + nodeWidth + levelGap,
            y: y + nodeHeight / 2 - 15,
            locationCount: node.locationCount,
            children: node.children,
          });
          if (expandedLocations.has(node.id)) {
            const childrenResult = calculateLayout(
              node.children.filter(Boolean),
              level + 1,
              y
            );
            results = results.concat(childrenResult);
            childrenResult.forEach((locationNode) => {
              if (locationNode.type === 'location') {
                results.push({
                  id: `${locationNode.id}-spacer`,
                  name: '',
                  type: 'location-spacer',
                  parentId: node.id,
                  x: locationNode.x + nodeWidth + levelGap,
                  y: locationNode.y + nodeHeight / 2 - 15,
                });
              }
            });
            if (childrenResult.length > 0) {
              const lastChild = childrenResult[childrenResult.length - 1];
              currentY = lastChild.y;
            }
          }
        } else {
          const childrenResult = calculateLayout(
            node.children.filter(Boolean),
            level + 1,
            y
          );
          results = results.concat(childrenResult);
          if (childrenResult.length > 0) {
            const lastChild = childrenResult[childrenResult.length - 1];
            currentY = lastChild.y;
          }
        }
      }
      currentY += nodeHeight;
    });
    return results;
  };

  const findOrganization = (node) => {
    console.log("findOrganization called with node:", node);
    if (!transformedData) return {};
    if (node.type === 'organization') return { name: node.name, id: node.id };
    
    // First try to find organization by parentOrgId if available
    if (node.parentOrgId) {
      const orgByParentId = transformedData.find(org => org.id === node.parentOrgId);
      if (orgByParentId) {
        console.log("Found organization by parentOrgId:", orgByParentId.name);
        return { name: orgByParentId.name, id: orgByParentId.id };
      }
    }
    
    // Fallback to the old method if parentOrgId doesn't work
    console.log("Falling back to old search method");
    const matchingOrgs = transformedData.filter((org) =>
      org.children?.some(
        (child) =>
          child.id === node.id ||
          child.children?.some((loc) => loc.id === node.id)
      )
    );
    
    console.log("Matching organizations for node:", node.name, "ID:", node.id, "=>", matchingOrgs.map(o => o.name));
    
    const org = transformedData.find((org) =>
      org.children?.some(
        (child) =>
          child.id === node.id ||
          child.children?.some((loc) => loc.id === node.id)
      )
    );
    
    console.log("Selected organization:", org?.name);
    return { name: org?.name, id: org?.id };
  };
  const findCorporate = (node) => {
    if (!transformedData) return {};
    if (node.type === 'corporate') return { name: node.name, id: node.id };
    const org = transformedData.find((org) =>
      org.children?.some((corp) =>
        corp.children?.some((loc) => loc.id === node.id)
      )
    );
    const corp = org?.children?.find((corp) =>
      corp.children?.some((loc) => loc.id === node.id)
    );
    return { name: corp?.name, id: corp?.id };
  };

  const layoutNodes = transformedData ? calculateLayout(transformedData) : [];
  const maxHeight =
    layoutNodes.length > 0
      ? Math.max(...layoutNodes.map((node) => node.y)) + nodeHeight + 100
      : 200;

  // --- Events ---
  const handleNodeClick = (node) => {
    const nodeData = {
      ...node,
      organization: findOrganization(node),
      corporate: node.type === 'location' ? findCorporate(node).name : null,
    };
    setSelectedNode(nodeData);
    setIsModalOpen(true);
    setActiveNode(node.id);
  };
  const toggleLocations = (corporateId, event) => {
    event.stopPropagation();
    setExpandedLocations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(corporateId)) {
        newSet.delete(corporateId);
      } else {
        newSet.add(corporateId);
      }
      return newSet;
    });
  };

  // --- Quick add logic ---
  const [hoveredNode, setHoveredNode] = useState(null);
  const [quickAddModal, setQuickAddModal] = useState({
    isOpen: false,
    type: null,
    parentNode: null,
  });
  const handleQuickAdd = (e, type, node, isSibling = false) => {
    e.stopPropagation();
    console.log("handleQuickAdd called - type:", type, "node:", node);
    
    if (type === 'corporate') {
      const organization = findOrganization(node);
      console.log("For corporate type - found organization:", organization);
      setQuickAddModal({
        isOpen: true,
        type,
        parentNode: {
          name: organization.name,
          id: organization.id,
        },
      });
    } else if (type === 'location') {
      const corporateEntity = transformedData
        .find((org) =>
          org.children?.some((corp) => corp.id === findCorporate(node).id)
        )
        ?.children?.find((corp) => corp.id === findCorporate(node).id);

      const organization = findOrganization(node);

      setQuickAddModal({
        isOpen: true,
        type,
        parentNode: {
          ...corporateEntity,
          organization: organization.name,
        },
      });
    } else {
      setQuickAddModal({
        isOpen: true,
        type,
        parentNode: node,
      });
    }
  };

  // --- Styling helpers ---
  const getNodeStyle = (type) => {
    switch (type) {
      case 'organization':
      case 'corporate':
      case 'location':
        return {
          rect: 'fill-white stroke-transparent hover:fill-white hover:drop-shadow-lg',
          text: 'text-[#007eef]',
          group: 'cursor-pointer',
        };
      case 'location-header':
        return { text: 'text-[#007eef]', group: 'cursor-pointer' };
      case 'location-spacer':
        return {
          rect: 'fill-none stroke-none',
          text: 'text-purple-600',
          group: '',
        };
      default:
        return {
          rect: 'fill-white stroke-transparent hover:stroke-gray-600 stroke-[1.5] fill-gray-600/60',
          text: '[color:#007eef]',
          group: 'cursor-pointer',
        };
    }
  };

  // --- SVG Connection line helpers ---
  const renderCurvedLine = (startX, startY, endX, endY) => {
    const midX = (startX + endX) / 2;
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
  };
  const renderStraightLine = (startX, startY, endX, endY) => {
    return {
      d: `M ${startX} ${startY} L ${endX} ${endY}`,
      strokeDasharray: '4,4',
    };
  };

  // --- Add buttons (top) ---
  const AddButtons = () => (
    <div className='flex mt-8 ms-8 mb-4 gap-[8rem]'>
      {isAdmin && (
        <>
          <div style={{ width: nodeWidth }}>
            <Link
              href='/dashboard/OrgStructure/forms/Organization'
              className='text-sky-600 text-xs font-bold leading-[15px] flex items-center justify-center border border-sky-600 py-2 px-4 hover:text-white hover:bg-sky-600 transition-all w-full rounded-md'
            >
              <FaPlus className='mr-2' size={12} />
              Add Organization
            </Link>
          </div>
          <div style={{ width: nodeWidth }}>
            <Link
              href='/dashboard/OrgStructure/forms/Entity'
              className='text-sky-600 text-xs font-bold leading-[15px] flex items-center justify-center border border-sky-600 py-2 px-4 hover:text-white hover:bg-sky-600 transition-all w-full rounded-md'
            >
              <FaPlus className='mr-2' size={12} />
              Add Corporate
            </Link>
          </div>
          <div style={{ width: nodeWidth }}>
            <Link
              href='/dashboard/OrgStructure/forms/Location'
              className='text-sky-600 text-xs font-bold leading-[15px] flex items-center justify-center border border-sky-600 py-2 px-4 hover:text-white hover:bg-sky-600 transition-all w-full rounded-md'
            >
              <FaPlus className='mr-2' size={12} />
              Add Location
            </Link>
          </div>
        </>
      )}
    </div>
  );

  const MAX_NODE_TEXT_LENGTH = 20;
  const MAX_INFO_TEXT_LENGTH = 25;

  const TruncatedNodeContent = ({
    name,
    info,
    nodeWidth,
    nodeHeight,
    activeNodeId,
    nodeId,
  }) => {
    const isNameTruncated = name.length > MAX_NODE_TEXT_LENGTH;
    const isInfoTruncated = info.length > MAX_INFO_TEXT_LENGTH;
    const shouldShowTooltip = isNameTruncated || isInfoTruncated;

    const truncatedName = isNameTruncated
      ? `${name.substring(0, MAX_NODE_TEXT_LENGTH)}...`
      : name;
    const truncatedInfo = isInfoTruncated
      ? `${info.substring(0, MAX_INFO_TEXT_LENGTH)}...`
      : info;

    return (
      <g pointerEvents='none'>
        <text
          x={10}
          y={nodeHeight / 2 - 8}
          className={`text-sm font-medium fill-[#007eef] ${
            activeNodeId === nodeId ? 'fill-[#0056a3]' : ''
          }`}
          dominantBaseline='middle'
        >
          {truncatedName}
        </text>
        <text
          x={10}
          y={nodeHeight / 2 + 12}
          className={`text-xs fill-gray-500 ${
            activeNodeId === nodeId ? 'fill-gray-700' : ''
          }`}
          dominantBaseline='middle'
        >
          {truncatedInfo}
        </text>
        {shouldShowTooltip && (
          <g className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            <rect
              x={nodeWidth / 2 - Math.max(name.length, info.length) * 4}
              y={-55}
              width={Math.max(name.length, info.length) * 8}
              height='50'
              rx='4'
              className='fill-white drop-shadow-lg border border-gray-300'
            />
            <text
              x={nodeWidth / 2}
              y={-35}
              className='text-xs fill-gray-700 font-medium'
              textAnchor='middle'
              dominantBaseline='middle'
            >
              {name}
            </text>
            <text
              x={nodeWidth / 2}
              y={-15}
              className='text-xs fill-gray-500'
              textAnchor='middle'
              dominantBaseline='middle'
            >
              {info}
            </text>
          </g>
        )}
      </g>
    );
  };

  // --- MAIN SVG ---
  return (
    <div ref={containerRef} className='w-full overflow-x-auto'>
      <AddButtons />
      <svg width={containerWidth} height={maxHeight} className=''>
        <g transform={`translate(30, 40)`}>
          {/* Connection lines */}
          {layoutNodes.map((node) => {
            if (node.type === 'location-header') {
              const parentNode = layoutNodes.find(
                (n) => n.id === node.parentId && n.type === 'corporate'
              );
              if (parentNode) {
                const linePath = renderStraightLine(
                  parentNode.x + nodeWidth,
                  parentNode.y + nodeHeight / 2,
                  node.x,
                  node.y + 15
                );
                return (
                  <path
                    key={`${parentNode.id}-${node.id}`}
                    d={linePath.d}
                    fill='none'
                    stroke='#CBD5E1'
                    strokeWidth='1.5'
                    strokeDasharray={linePath.strokeDasharray}
                  />
                );
              }
            }
            if (node.children) {
              if (node.type === 'corporate') {
                if (expandedLocations.has(node.id)) {
                  return node.children.map((child, index) => {
                    const childNode = layoutNodes.find(
                      (n) => n.id === child.id && n.type === 'location'
                    );
                    if (childNode) {
                      return (
                        <path
                          key={`${node.id}-${child.id}-${index}`}
                          d={renderCurvedLine(
                            node.x + nodeWidth,
                            node.y + nodeHeight / 2,
                            childNode.x,
                            childNode.y + nodeHeight / 2
                          )}
                          fill='none'
                          stroke='#CBD5E1'
                          strokeWidth='1.5'
                        />
                      );
                    }
                    return null;
                  });
                }
              } else if (node.type === 'organization') {
                return node.children.map((child, index) => {
                  const childNode = layoutNodes.find(
                    (n) =>
                      n.id === child.id &&
                      n.type !== 'location-header' &&
                      n.type !== 'location' &&
                      n.type !== 'organization'
                  );
                  if (childNode) {
                    return (
                      <path
                        key={`${node.id}-${child.id}-${index}`}
                        d={renderCurvedLine(
                          node.x + nodeWidth,
                          node.y + nodeHeight / 2,
                          childNode.x,
                          childNode.y + nodeHeight / 2
                        )}
                        fill='none'
                        stroke='#CBD5E1'
                        strokeWidth='1.5'
                      />
                    );
                  }
                  return null;
                });
              }
            }
            return null;
          })}

          {/* Nodes */}
          {layoutNodes.map((node) => {
            const style = getNodeStyle(node.type);
            const isLocationHeader = node.type === 'location-header';
            const isLocationSpacer = node.type === 'location-spacer';
            const isExpanded = expandedLocations.has(node.parentId);

            if (isLocationHeader || isLocationSpacer) {
              if (isLocationHeader) {
                const displayText = `${node.locationCount} Location${
                  node.locationCount !== 1 ? 's' : ' '
                }`;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x + 55},${node.y + 12})`}
                    className='cursor-pointer'
                    onClick={(e) => toggleLocations(node.parentId, e)}
                  >
                    <g className='flex items-center ml-2'>
                      <text
                        className={`text-sm font-medium ${style.text}`}
                        dominantBaseline='middle'
                        fill='#007eef'
                      >
                        {displayText}
                      </text>
                      <g
                        transform={`translate(${
                          displayText.length * 12 + 10
                        }, 0)`}
                      >
                        {isExpanded ? (
                          <g transform='translate(0, 0)'>
                            <circle r='8' fill='#F3F4F6' />
                            <path
                              d='M4 8 L8 4 L12 8'
                              stroke='#6B7280'
                              strokeWidth='2'
                              fill='none'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              transform='translate(-8, -8)'
                            />
                          </g>
                        ) : (
                          <g transform='translate(0, 0)'>
                            <circle r='8' fill='#F3F4F6' />
                            <path
                              d='M4 4 L8 8 L12 4'
                              stroke='#6B7280'
                              strokeWidth='2'
                              fill='none'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              transform='translate(-8, -8)'
                            />
                          </g>
                        )}
                      </g>
                    </g>
                  </g>
                );
              } else {
                return '';
              }
            }
            return (
              <g
                key={`${node.id}-${node.type}`}
                transform={`translate(${node.x},${node.y})`}
                className={`transition-all duration-200 ${style.group} group cursor-pointer`}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <rect
                  width={nodeWidth}
                  height={nodeHeight}
                  rx='4'
                  className={`
                    fill-transparent 
                    transition-opacity 
                    duration-200
                    ${
                      activeNode === node.id
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }
                  `}
                  filter='drop-shadow(0 10px 15px rgb(0 0 0 / 0.1)) drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))'
                />
                <rect
                  width={nodeWidth}
                  height={nodeHeight}
                  rx='4'
                  className={`
                    ${style.rect} 
                    stroke-[1.5] 
                    transition-all
                    duration-200
                    ${
                      activeNode === node.id
                        ? 'stroke-[#007eef] !stroke-2'
                        : 'stroke-transparent'
                    }
                    ${activeNode === node.id ? 'drop-shadow-lg' : ''}
                  `}
                />
                <TruncatedNodeContent
                  name={node.name}
                  info={node.info}
                  nodeWidth={nodeWidth}
                  nodeHeight={nodeHeight}
                  activeNodeId={activeNode}
                  nodeId={node.id}
                />
                {isAdmin && hoveredNode === node.id && (
                  <>
                    {(node.type === 'organization' ||
                      node.type === 'corporate') && (
                      <g
                        transform={`translate(${nodeWidth + 10}, ${
                          nodeHeight / 2
                        })`}
                        className='cursor-pointer'
                        onClick={(e) =>
                          handleQuickAdd(
                            e,
                            node.type === 'organization'
                              ? 'corporate'
                              : 'location',
                            node,
                            false
                          )
                        }
                      >
                        <g className='group/add-right'>
                          <g className='opacity-0 group-hover/add-right:opacity-100 transition-opacity duration-200'>
                            <rect
                              x='-65'
                              y='-45'
                              width='130'
                              height='28'
                              rx='4'
                              className='fill-white'
                              filter='drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))'
                            />
                            <text
                              x='0'
                              y='-31'
                              fontSize='11'
                              fill='#4B5563'
                              textAnchor='middle'
                              dominantBaseline='middle'
                              className='font-medium'
                            >
                              Quick Add{' '}
                              {node.type === 'organization'
                                ? 'Corporate'
                                : 'Location'}
                            </text>
                          </g>
                          <circle
                            r='10'
                            className='transition-all duration-200 fill-white stroke-[#007eef] group-hover/add-right:fill-[#007eef]'
                            strokeWidth='1'
                            filter='drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))'
                          />
                          <line
                            x1='-4'
                            y1='0'
                            x2='4'
                            y2='0'
                            className='transition-all duration-200 stroke-[#007eef] group-hover/add-right:stroke-white'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                          />
                          <line
                            x1='0'
                            y1='-4'
                            x2='0'
                            y2='4'
                            className='transition-all duration-200 stroke-[#007eef] group-hover/add-right:stroke-white'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                          />
                        </g>
                      </g>
                    )}
                    {/* Bottom Quick Add Button (for siblings) */}
                    <g
                      transform={`translate(${nodeWidth / 2}, ${
                        nodeHeight + 10
                      })`}
                      className='cursor-pointer'
                      onClick={(e) => handleQuickAdd(e, node.type, node, true)}
                    >
                      <g className='group/add-bottom'>
                        <g className='opacity-0 group-hover/add-bottom:opacity-100 transition-opacity duration-200'>
                          <rect
                            x='10'
                            y='-14'
                            width='130'
                            height='28'
                            rx='4'
                            className='fill-white'
                            filter='drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))'
                          />
                          <text
                            x='75'
                            y='0'
                            fontSize='11'
                            fill='#4B5563'
                            textAnchor='middle'
                            dominantBaseline='middle'
                            className='font-medium'
                          >
                            Quick Add{' '}
                            {node.type.charAt(0).toUpperCase() +
                              node.type.slice(1)}
                          </text>
                        </g>
                        <circle
                          r='10'
                          className='transition-all duration-200 fill-white stroke-[#007eef] group-hover/add-bottom:fill-[#007eef]'
                          strokeWidth='1'
                          filter='drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))'
                        />
                        <line
                          x1='-4'
                          y1='0'
                          x2='4'
                          y2='0'
                          className='transition-all duration-200 stroke-[#007eef] group-hover/add-bottom:stroke-white'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                        <line
                          x1='0'
                          y1='-4'
                          x2='0'
                          y2='4'
                          className='transition-all duration-200 stroke-[#007eef] group-hover/add-bottom:stroke-white'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </g>
                    </g>
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <NodeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nodeData={selectedNode}
        nodeType={selectedNode?.type}
        rawData={data}
        setActiveNode={setActiveNode}
        isAdmin={isAdmin}
      />
      {isAdmin && (
        <QuickAddModal
          isOpen={quickAddModal.isOpen}
          onClose={() =>
            setQuickAddModal({ isOpen: false, type: null, parentNode: null })
          }
          type={quickAddModal.type}
          parentName={quickAddModal.parentNode}
        />
      )}
    </div>
  );
};

const OrganizationTreePage = () => {
  const [orgData, setOrgData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.BACKEND_API_URL}/structure`
        );
        setOrgData(response.data);
      } catch (error) {
        console.error('Error fetching organization data:', error);
      }
    };
    fetchData();
  }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHeadertext1('Organization Structure'));
    dispatch(setHeaderdisplay(null));
    dispatch(setHeadertext2(null));
    dispatch(setMiddlename(null));
  }, [dispatch]);

  if (!orgData) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-600'>Loading organization structure...</div>
      </div>
    );
  }
  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} />
      <div className='w-full p-4 rounded-lg bg-white hidden xl:block lg:block 2xl:block 3xl:block 4k:block 2k:block'>
        <div className="text-[22px] font-medium font-['Manrope'] leading-relaxed gradient-text pb-6">
          Organization Structure
        </div>
        <hr className='mb-4' />
        <div className='mb-8'>
          <div className='mb-2'>
            <h1 className='text-xl'>Organization Hierarchy</h1>
          </div>
          <div className='text-gray-600'>
            Click on any Organization, Corporate or Location to view the details
            about them.
          </div>
        </div>
        <OrgTree data={orgData} />
      </div>
      <div className='block xl:hidden lg:hidden 2xl:hidden 3xl:hidden 4k:hidden 2k:hidden'>
        <OrgTreeMobile data={orgData} />
      </div>
    </>
  );
};

export default OrganizationTreePage;