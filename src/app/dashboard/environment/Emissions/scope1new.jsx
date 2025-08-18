"use client";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useRef,
  useMemo,
  Suspense,
  lazy,
} from "react";
import ReactDOM from "react-dom"; // Add this import
import Portal from "../../../shared/components/Portal";
import { useDispatch, useSelector } from "react-redux";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Oval } from "react-loader-spinner";
import CalculateSuccess from "./calculateSuccess";
import {
  updateScopeData,
  updateScopeDataLocal,
  setValidationErrors,
  fetchAssignedTasks,
} from "@/lib/redux/features/emissionSlice";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { validateEmissionsData } from "./emissionValidation";
import { del } from "../../../utils/axiosMiddleware";
import ExpandedRowsModal from "../../../shared/components/ExpandedRowsModal";
import { CiViewTable } from "react-icons/ci";
import ScopeTableSkeleton from "@/app/shared/components/ScopeTableSkeleton";

// Lazy load EmissionWidget for better performance
const LazyEmissionWidget = lazy(() =>
  import("../../../shared/widgets/emissionWidget")
);

const local_schema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      Emission: {
        type: ["string", "object", "null"],
        title: "Emissionsscop1",
      },
    },
  },
};

const local_ui_schema = {
  items: {
    Emission: {
      "ui:widget": "EmissionWidget",
      "ui:options": {
        label: false,
      },
      "ui:horizontal": true,
    },
    "ui:order": ["Emission"],
    "ui:options": {
      layout: "horizontal",
      addable: false,
      orderable: false,
      removable: false,
    },
  },
};

const Scope1 = forwardRef(
  (
    {
      location,
      year,
      month,
      successCallback,
      countryCode,
      setAccordionOpen,
      dataError,
      showError,
    },
    ref
  ) => {
    const dispatch = useDispatch();

    // Redux selectors
    const scope1State = useSelector((state) => state.emissions.scope1Data);
    const selectedRows = useSelector(
      (state) => state.emissions.selectedRows["scope1"]
    );
    const previousMonthData = useSelector(
      (state) => state.emissions.previousMonthData
    );
    const autoFill = useSelector((state) => state.emissions.autoFill);
    const assigned_data = useSelector((state) => state.emissions.assignedTasks);
    const approved_data = useSelector((state) => state.emissions.approvedTasks);
    const validationErrors = useSelector(
      (state) => state.emissions.validationErrors
    );
    const scopeReRender = useSelector((state) => state.emissions.scopeReRender);

    // Existing state
    const [r_schema, setRemoteSchema] = useState({});
    const [r_ui_schema, setRemoteUiSchema] = useState({});
    const [loopen, setLoOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [activityCache, setActivityCache] = useState({});
    const [hasAutoFilled, setHasAutoFilled] = useState(false);

    // Modal state for expanded view
    const [isExpandedModalOpen, setIsExpandedModalOpen] = useState(false);

    // Virtual scrolling state
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [itemHeight, setItemHeight] = useState(80);
    const [isScrolling, setIsScrolling] = useState(false);

    // Refs
    const scrollContainerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const formRef = useRef();

    // Virtual scrolling constants
    const VISIBLE_ITEMS = 20;
    const OVERSCAN = 5;

    // Processing queue for activity details
    const processActivityDetailsQueue = useMemo(() => {
      const queue = [];
      let isProcessing = false;

      const processNext = async () => {
        if (isProcessing || queue.length === 0) return;

        isProcessing = true;
        const task = queue.shift();

        try {
          await task();
        } catch (error) {
          console.error("Error processing activity details:", error);
        }

        isProcessing = false;

        if (queue.length > 0) {
          setTimeout(processNext, 100);
        }
      };

      return {
        add: (task) => {
          queue.push(task);
          processNext();
        },
      };
    }, []);

    // Full formData from Redux
    const formData = Array.isArray(scope1State.data?.data)
      ? scope1State.data.data
      : [];

    // Dynamic height calculation using useLayoutEffect
    useLayoutEffect(() => {
      const calculateDimensions = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const viewportHeight = window.innerHeight;
        const containerTop = container.getBoundingClientRect().top;
        const availableHeight = viewportHeight - containerTop - 100;
        const maxHeight = Math.min(availableHeight, viewportHeight * 0.7);

        setContainerHeight(Math.max(300, maxHeight));

        const firstRow = container.querySelector(
          "tbody > tr, tr, .emission-row, [data-row]"
        );
        if (firstRow) {
          const rowRect = firstRow.getBoundingClientRect();
          const measuredHeight = Math.max(60, rowRect.height + 4);
          setItemHeight(measuredHeight);
        }
      };

      calculateDimensions();

      if (scrollContainerRef.current) {
        resizeObserverRef.current = new ResizeObserver(() => {
          calculateDimensions();
        });
        resizeObserverRef.current.observe(scrollContainerRef.current);
      }

      const handleResize = debounce(calculateDimensions, 100);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
      };
    }, [formData.length]);

    // Virtual scrolling calculations
    const virtualScrollData = useMemo(() => {
      const totalItems = formData.length;

      if (totalItems === 0 || containerHeight === 0) {
        return {
          startIndex: 0,
          endIndex: 0,
          visibleItems: [],
          totalHeight: 0,
          offsetY: 0,
          visibleCount: 0,
        };
      }

      const itemsInViewport = Math.ceil(containerHeight / itemHeight);
      const visibleCount = Math.min(VISIBLE_ITEMS, itemsInViewport + OVERSCAN);
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(start + visibleCount, totalItems);
      const startWithOverscan = Math.max(0, start - OVERSCAN);
      const endWithOverscan = Math.min(totalItems, end + OVERSCAN);

      const visibleItems = formData.slice(startWithOverscan, endWithOverscan);
      const totalHeight = totalItems * itemHeight;
      const offsetY = startWithOverscan * itemHeight;

      return {
        startIndex: startWithOverscan,
        endIndex: endWithOverscan,
        visibleItems,
        totalHeight,
        offsetY,
        visibleCount: endWithOverscan - startWithOverscan,
      };
    }, [
      formData,
      scrollTop,
      itemHeight,
      containerHeight,
      VISIBLE_ITEMS,
      OVERSCAN,
    ]);

    const {
      startIndex,
      endIndex,
      visibleItems,
      totalHeight,
      offsetY,
      visibleCount,
    } = virtualScrollData;

    // Scroll handler
    const handleScroll = useCallback((e) => {
      const newScrollTop = e.target.scrollTop;
      setScrollTop(newScrollTop);
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    }, []);

    // Handle changes in virtual scrolling context
    const handleVirtualChange = useCallback(
      (e) => {
        const updatedFormData = [...formData];

        e.formData.forEach((changedRow, virtualIndex) => {
          const actualIndex = startIndex + virtualIndex;
          if (actualIndex >= 0 && actualIndex < updatedFormData.length) {
            updatedFormData[actualIndex] = changedRow;
          }
        });

        dispatch(
          updateScopeDataLocal({ scope: 1, data: { data: updatedFormData } })
        );

        // Validation logic
        const currentValidationErrors = validationErrors?.scope1?.fields || {};

        if (Object.keys(currentValidationErrors).length > 0) {
          const validationResult = validateEmissionsData(
            {
              data: { data: updatedFormData },
            },
            "Scope 1"
          );

          if (validationResult.hasErrors) {
            const newValidationFields = {};
            Object.keys(currentValidationErrors).forEach((rowIndex) => {
              if (validationResult.fields[rowIndex]) {
                newValidationFields[rowIndex] =
                  validationResult.fields[rowIndex];
              }
            });

            dispatch(
              setValidationErrors({
                ...validationErrors,
                scope1: {
                  fields: newValidationFields,
                  messages: validationResult.messages,
                  emptyFields: validationResult.emptyFields,
                },
              })
            );
          } else {
            const { scope1, ...otherScopeErrors } = validationErrors;
            dispatch(setValidationErrors(otherScopeErrors));
          }
        }
      },
      [dispatch, validationErrors, formData, startIndex]
    );

    // Imperative handle for Calculate button
    useImperativeHandle(ref, () => ({
      updateFormData: () => {
        // Use the full formData, not just visible items
        const formattedData = formData
          .filter((row) => {
            return !["assigned"].includes(row.Emission?.rowType);
          })
          .map((row) => {
            if (row.Emission?.rowType === "approved") {
              const { id, Emission, ...rest } = row;
              return {
                Emission,
                id,
                ...rest,
              };
            }
            return row;
          });

        if (formattedData.length > 0) {
          return updateFormData(formattedData);
        }

        return Promise.resolve();
      },
    }));

    const LoaderOpen = () => setLoOpen(true);
    const LoaderClose = () => setLoOpen(false);

    // Add new row
    const handleAddNew = useCallback(() => {
      const newRow = { Emission: {} };

      const assignedRows = formData.filter(
        (row) => row.Emission?.rowType === "assigned"
      );
      const approvedRows = formData.filter(
        (row) => row.Emission?.rowType === "approved"
      );
      const regularRows = formData.filter(
        (row) =>
          !row.Emission?.rowType ||
          (row.Emission.rowType !== "assigned" &&
            row.Emission.rowType !== "approved")
      );

      const updatedRegularRows = [...regularRows, newRow];
      const updatedFormData = [
        ...assignedRows,
        ...approvedRows,
        ...updatedRegularRows,
      ];

      dispatch(
        updateScopeDataLocal({
          scope: 1,
          data: { data: updatedFormData },
        })
      );

      // Scroll to new row
      setTimeout(() => {
        if (scrollContainerRef.current && itemHeight > 0) {
          const newRowIndex = updatedFormData.length - 1;
          const newScrollTop = Math.max(
            0,
            newRowIndex * itemHeight - containerHeight / 2
          );
          scrollContainerRef.current.scrollTop = newScrollTop;
        }
      }, 100);
    }, [formData, dispatch, itemHeight, containerHeight]);

    const deleteTask = async (taskId) => {
      try {
        const response = await del(`organization_task_dashboard/${taskId}`);
        if (response.status === 204) {
          toast.success("Task deleted successfully");
        } else {
          toast.error("Failed to delete task");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      }
    };

    // Remove row
    const handleRemoveRow = useCallback(
      async (index) => {
        const parsedIndex = parseInt(index, 10);
        const actualIndex = parsedIndex;

        const rowToRemove = formData[actualIndex];

        if (!rowToRemove) {
          console.error("Row not found at index:", actualIndex);
          return;
        }

        const rowType = rowToRemove.Emission?.rowType;

        if (rowType === "approved") {
          toast.error("Cannot delete approved task row");
          return;
        }

        if (rowType === "assigned") {
          await deleteTask(rowToRemove.id);
          dispatch(fetchAssignedTasks());
        }

        const updatedData = formData.filter((_, i) => i !== actualIndex);

        dispatch(
          updateScopeDataLocal({ scope: 1, data: { data: updatedData } })
        );

        // Adjust scroll position if necessary
        if (scrollContainerRef.current && updatedData.length > 0) {
          const maxScrollTop = Math.max(
            0,
            updatedData.length * itemHeight - containerHeight
          );
          if (scrollTop > maxScrollTop) {
            scrollContainerRef.current.scrollTop = maxScrollTop;
          }
        }

        // Handle validation errors
        const currentValidationErrors = validationErrors?.scope1?.fields || {};

        if (Object.keys(currentValidationErrors).length > 0) {
          const newValidationFields = {};

          Object.entries(currentValidationErrors).forEach(
            ([rowIdx, errors]) => {
              const currentIndex = parseInt(rowIdx);

              if (currentIndex < actualIndex) {
                newValidationFields[currentIndex] = errors;
              } else if (currentIndex > actualIndex) {
                newValidationFields[currentIndex - 1] = errors;
              }
            }
          );

          if (Object.keys(newValidationFields).length > 0) {
            dispatch(
              setValidationErrors({
                scope1: {
                  ...validationErrors.scope1,
                  fields: newValidationFields,
                },
              })
            );
          } else {
            dispatch(setValidationErrors({}));
          }
        }

        if (rowType === "calculated") {
          try {
            await updateFormData(updatedData);
          } catch (error) {
            console.error("Failed to update form data:", error);
            toast.error("Failed to update data on the server");
            return;
          }
        }

        if (actualIndex === 0 && updatedData.length === 0) {
          setAccordionOpen(false);
        }
      },
      [
        formData,
        dispatch,
        setAccordionOpen,
        validationErrors,
        scrollTop,
        itemHeight,
        containerHeight,
      ]
    );

    const updateFormData = useCallback(
      async (data) => {
        LoaderOpen();
        try {
          await dispatch(
            updateScopeData({ scope: 1, data: { data }, location, year, month })
          ).unwrap();
          successCallback();
        } catch (error) {
          setModalData({
            message: "Oops, something went wrong",
          });
        } finally {
          LoaderClose();
        }
      },
      [dispatch, location, year, month, successCallback]
    );

    const updateCache = useCallback((cacheKey, activities) => {
      setActivityCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: activities,
      }));
    }, []);

    // Schema setup
    useEffect(() => {
      if (
        scope1State.status === "succeeded" &&
        scope1State.schema &&
        scope1State.uiSchema
      ) {
        setRemoteSchema(scope1State.schema);
        setRemoteUiSchema(scope1State.uiSchema);
      }
    }, [scope1State.status, scope1State.schema, scope1State.uiSchema]);

    // Data merging effect
    useEffect(() => {
      const allDataReceived =
        formData &&
        assigned_data.status === "succeeded" &&
        approved_data.status === "succeeded" &&
        (!autoFill || (autoFill && previousMonthData.status === "succeeded"));

      if (!allDataReceived) return;

      const debouncedDataMerge = debounce(() => {
        try {
          const dataMap = new Map();
          const itemsWithoutIds = [];

          formData.forEach((item) => {
            if (item.id) {
              dataMap.set(item.id, item);
            } else if (item.autofillId) {
              dataMap.set(item.autofillId, item);
            } else {
              itemsWithoutIds.push(item);
            }
          });

          if (assigned_data.scope1?.length) {
            assigned_data.scope1.forEach((task) => {
              dataMap.set(task.id, {
                ...task,
                Emission: {
                  ...task.Emission,
                  rowType: "assigned",
                },
              });
            });
          }

          if (approved_data.scope1?.length) {
            approved_data.scope1.forEach((task) => {
              if (!dataMap.has(task.id)) {
                dataMap.set(task.id, {
                  ...task,
                  Emission: {
                    ...task.Emission,
                    rowType: "approved",
                  },
                });
              }
            });
          }

          const hasOnlySystemEntries = Array.from(dataMap.values()).every(
            (item) =>
              item.Emission?.rowType === "assigned" ||
              item.Emission?.rowType === "approved"
          );

          if (
            autoFill &&
            previousMonthData.status === "succeeded" &&
            previousMonthData.scope1Data?.data &&
            (dataMap.size === 0 ||
              (hasOnlySystemEntries && itemsWithoutIds.length === 0))
          ) {
            previousMonthData.scope1Data.data.forEach((item) => {
              if (!dataMap.has(item.autofillId)) {
                const updatedEmission = { ...item.Emission };
                updatedEmission.Unit = "";
                updatedEmission.Quantity = "";
                updatedEmission.assigned_to = "";
                updatedEmission.file = {};
                if (updatedEmission.unit_type?.includes("Over")) {
                  updatedEmission.Unit2 = "";
                  updatedEmission.Quantity2 = "";
                }

                dataMap.set(item.autofillId, {
                  ...item,
                  Emission: updatedEmission,
                });
              }
            });

            setHasAutoFilled(true);
          }

          const updatedFormData = [
            ...Array.from(dataMap.values()),
            ...itemsWithoutIds,
          ];

          const currentDataString = JSON.stringify(formData);
          const newDataString = JSON.stringify(updatedFormData);

          if (currentDataString !== newDataString) {
            dispatch(
              updateScopeDataLocal({
                scope: 1,
                data: { data: updatedFormData },
              })
            );
          }
        } catch (error) {
          console.error("Error merging data:", error);
        }
      }, 300);

      debouncedDataMerge();

      return () => {
        debouncedDataMerge.cancel();
      };
    }, [
      formData,
      assigned_data.status,
      approved_data.status,
      previousMonthData.status,
      autoFill,
      JSON.stringify(assigned_data.scope1),
      JSON.stringify(approved_data.scope1),
      JSON.stringify(previousMonthData.scope1Data?.data),
    ]);

    // Reset autofill flag and trigger data refetch
    useEffect(() => {
      setHasAutoFilled(false);
      // Force data refresh when location, year, or month changes
      if (location && year && month) {
        dispatch(fetchAssignedTasks({ location, year, month }));
      }
    }, [location, year, month, dispatch]);

    // Scope re-render effect
    useEffect(() => {}, [scopeReRender]);

    // Cleanup effect
    useEffect(() => {
      return () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
      };
    }, []);

    // Add a ref to track previous validation errors
    const prevValidationErrorsRef = useRef();

    useEffect(() => {
      const currentErrors = validationErrors?.scope1?.fields;
      const prevErrors = prevValidationErrorsRef.current;

      // Check if validation errors have changed (new errors appeared)
      const hasNewErrors =
        currentErrors &&
        (!prevErrors ||
          Object.keys(currentErrors).length >
            Object.keys(prevErrors || {}).length);

      console.log("Validation errors changed:", {
        hasNewErrors,
        currentErrors,
        prevErrors,
        hasContainer: !!scrollContainerRef.current,
        containerHeight,
        itemHeight,
      });

      if (
        hasNewErrors &&
        scrollContainerRef.current &&
        containerHeight > 0 &&
        itemHeight > 0 &&
        formData.length > 0
      ) {
        // Small delay to ensure DOM has updated
        setTimeout(() => {
          const container = scrollContainerRef.current;
          if (!container) return;

          const errorRowIndices = Object.keys(currentErrors)
            .map(Number)
            .filter((index) => !isNaN(index));

          if (errorRowIndices.length > 0) {
            const firstErrorRowIndex = Math.min(...errorRowIndices);
            const rowPosition = firstErrorRowIndex * itemHeight;
            const currentScrollTop = container.scrollTop;
            const containerHalfHeight = containerHeight / 2;
            const rowVisiblePosition = rowPosition - currentScrollTop;

            console.log("Auto-scroll check:", {
              firstErrorRowIndex,
              rowPosition,
              currentScrollTop,
              containerHalfHeight,
              rowVisiblePosition,
              shouldScroll: rowVisiblePosition > containerHalfHeight,
            });

            if (rowVisiblePosition > containerHalfHeight) {
              const maxScrollTop = Math.max(
                0,
                formData.length * itemHeight - containerHeight
              );
              const newScrollTop = Math.min(
                currentScrollTop + 380,
                maxScrollTop
              );

              console.log("Auto-scrolling to:", newScrollTop);

              container.scrollTo({
                top: newScrollTop,
                behavior: "smooth",
              });
            }
          }
        }, 100);
      }

      // Update the ref with current errors
      prevValidationErrorsRef.current = currentErrors;
    }, [
      validationErrors?.scope1?.fields,
      containerHeight,
      itemHeight,
      formData.length,
    ]);

    // Loading state
    if (scope1State.status === "loading") {
      return (
        <div className="flex items-center justify-center">
          <Oval
            height={50}
            width={50}
            color="#00BFFF"
            secondaryColor="#f3f3f3"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      );
    }

    // Error state
    if (scope1State.status === "failed") {
      return <div>Error loading data: {scope1State.error}</div>;
    }

    return (
      <>
        {/* Desktop version */}
        <div className="hidden xl:block lg:block md:block 2xl:block 4k:block 2k:block">
          <div
            ref={scrollContainerRef}
            className="overflow-x-hidden"
            style={{
              height: formData.length>0 ? containerHeight : "100px",
              maxHeight: "40vh",
              minHeight: "50px",
              position: "relative",
              // paddingBottom: '210px'
            }}
            onScroll={handleScroll}
          >
            {formData.length > 0 ? (
              <div style={{ height: totalHeight, position: "relative" }}>
                <div
                  style={{
                    transform: `translateY(${offsetY}px)`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  <Suspense fallback={<ScopeTableSkeleton rows={3} />}>
                    <Form
                      schema={local_schema}
                      uiSchema={local_ui_schema}
                      formData={visibleItems}
                      onChange={handleVirtualChange}
                      validator={validator}
                      widgets={{
                        EmissionWidget: (props) => (
                          <LazyEmissionWidget
                            {...props}
                            scope="scope1"
                            year={year}
                            countryCode={countryCode}
                            onRemove={handleRemoveRow}
                            index={
                              startIndex + parseInt(props.id.split("_")[1])
                            }
                            actualIndex={
                              startIndex + parseInt(props.id.split("_")[1])
                            }
                            activityCache={activityCache}
                            updateCache={updateCache}
                            formRef={formRef}
                            processQueue={processActivityDetailsQueue}
                            containerRef={scrollContainerRef}
                          />
                        ),
                      }}
                    />
                  </Suspense>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center justify-center text-gray-500"
                style={{ height: formData.length > 0 ? containerHeight : 100 }}
              >
                No data available
              </div>
            )}

            {/* Scroll progress indicator */}
            {isScrolling && formData.length > visibleCount && (
              <div
                className="fixed bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm"
                style={{
                  bottom: "20px",
                  right: "20px",
                  zIndex: 9999,
                }}
              >
                <span>Loading </span>
                {Math.round(
                  (scrollTop / Math.max(1, totalHeight - containerHeight)) * 100
                )}
                %
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-3">
            <button
              className="text-[#007EEF] px-4 py-2 rounded-md text-[14px] transition-colors duration-200 hover:bg-blue-50"
              onClick={handleAddNew}
            >
              + Add new
            </button>
          </div>
          <div className="text-xs text-gray-500 space-x-4 text-right flex items-center justify-end">
            {formData.length > 0 && (
              <span>
                Showing {startIndex + 1}-{Math.min(endIndex, formData.length)}{" "}
                of {formData.length} rows
              </span>
            )}
            {formData.length > 0 && (
              <button
                onClick={() => setIsExpandedModalOpen(true)}
                className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <CiViewTable /> <span>View all</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile version */}
        <div className="block xl:hidden lg:hidden md:hidden 2xl:hidden 4k:hidden 2k:hidden">
          <div
            className="overflow-x-auto custom-scrollbar overflow-y-auto"
            style={{
              height: formData.length > 0 ? Math.min(
                containerHeight || window.innerHeight * 0.6,
                window.innerHeight * 0.7
              ) : "100px",
              maxHeight: "40vh",
              minHeight: "50px",
              position: "relative",
            }}
            onScroll={handleScroll}
          >
            {formData.length > 0 ? (
              <div style={{ height: totalHeight, position: "relative" }}>
                <div
                  style={{
                    transform: `translateY(${offsetY}px)`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  <Suspense
                    fallback={
                      <div
                        className="flex items-center justify-center"
                        style={{ height: itemHeight }}
                      >
                        <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                      </div>
                    }
                  >
                    <Form
                      schema={local_schema}
                      uiSchema={local_ui_schema}
                      formData={visibleItems}
                      onChange={handleVirtualChange}
                      validator={validator}
                      widgets={{
                        EmissionWidget: (props) => (
                          <LazyEmissionWidget
                            {...props}
                            scope="scope1"
                            year={year}
                            countryCode={countryCode}
                            onRemove={handleRemoveRow}
                            index={
                              startIndex + parseInt(props.id.split("_")[1])
                            }
                            actualIndex={
                              startIndex + parseInt(props.id.split("_")[1])
                            }
                            activityCache={activityCache}
                            updateCache={updateCache}
                            formRef={formRef}
                            processQueue={processActivityDetailsQueue}
                            containerRef={scrollContainerRef}
                          />
                        ),
                      }}
                    />
                  </Suspense>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center justify-center text-gray-500"
                style={{ height: 50 }}
              >
                No data available
              </div>
            )}

            {/* Mobile scroll indicator */}
            {isScrolling && formData.length > visibleCount && (
              <div
                className="fixed bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs"
                style={{
                  top: "20px",
                  right: "20px",
                  zIndex: 9999,
                }}
              >
                {Math.round(
                  (scrollTop / Math.max(1, totalHeight - containerHeight)) * 100
                )}
                %
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              className="text-[#007EEF] px-4 py-2 rounded-md text-[14px]"
              onClick={handleAddNew}
            >
              + Add new
            </button>
            <div className="text-xs text-gray-500 flex items-center space-x-2">
              {formData.length > 0 && (
                <span>
                  {startIndex + 1}-{Math.min(endIndex, formData.length)} of{" "}
                  {formData.length}
                </span>
              )}
              {formData.length > 0 && (
                <button
                  onClick={() => setIsExpandedModalOpen(true)}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <CiViewTable /> View all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {loopen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            style={{ zIndex: 9999 }}
          >
            <Oval
              height={50}
              width={50}
              color="#00BFFF"
              secondaryColor="#f3f3f3"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        )}

        {/* Success modal */}
        {modalData && (
          <Portal>
            <CalculateSuccess
              data={modalData}
              onClose={() => setModalData(null)}
            />
          </Portal>
        )}

        {/* Expanded Modal for all rows */}
        <ExpandedRowsModal
          isOpen={isExpandedModalOpen}
          onClose={() => setIsExpandedModalOpen(false)}
          title="Scope emissions data"
          data={formData}
          columns={[
            {
              key: "Category",
              title: "Category",
              render: (row) =>  row.Emission?.Category || "-"
            },
            {
              key: "Subcategory",
              title: "Sub-Category",
              render: (row) => row.Emission?.Subcategory || "-",
            },
            {
              key: "Activity",
              title: "Activity",
              render: (row) => (
                <div
                  className="max-w-xs truncate"
                  title={row.Emission?.Activity}
                >
                  {row.Emission?.Activity || "-"}
                </div>
              ),
            },
            {
              key: "Quantity",
              title: "Quantity",
              render: (row) => {
                const emission = row.Emission || {};
                const quantity = emission.Quantity || "-";
                const quantity2 = emission.Quantity2
                  ? ` / ${emission.Quantity2}`
                  : "";
                return `${quantity}${quantity2}`;
              },
            },
            {
              key: "Unit",
              title: "Unit",
              render: (row) => {
                const emission = row.Emission || {};
                const unit = emission.Unit || "-";
                const unit2 = emission.Unit2 ? ` / ${emission.Unit2}` : "";
                return `${unit}${unit2}`;
              },
            },
          ]}
          getRowStatus={(row) => row.Emission?.rowType || "default"}
        />
      </>
    );
  }
);

Scope1.displayName = "Scope1";

export default Scope1;
