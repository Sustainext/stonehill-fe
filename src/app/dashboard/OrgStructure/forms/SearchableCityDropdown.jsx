import React, { useEffect, useRef, useState } from "react";
import { MdAdd, MdCheck, MdClose, MdExpandMore } from "react-icons/md";

const SearchableCityDropdown = ({
  cities = [],
  selectedCity,
  onSelectCity,
  onAddCity, // new prop to add city
  error,
  disabled = false,
}) => {
  console.log("SearchableCityDropdown props:", {selectedCity, cities: cities.length, disabled, onAddCity: !!onAddCity});
  const [searchTerm, setSearchTerm] = useState(selectedCity);
  const [filteredCities, setFilteredCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(null);
  const [isAddingCity, setIsAddingCity] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
        setPendingAdd(null);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    console.log("SearchableCityDropdown useEffect - searchTerm:", searchTerm, "cities:", cities.length);
    if (searchTerm) {
      const filtered = cities.filter((city) =>
        city.city_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);

      const exactMatch = cities.some(
        (city) => city.city_name.toLowerCase() === searchTerm.toLowerCase()
      );
      const shouldShowAdd = exactMatch ? null : searchTerm;
      console.log("exactMatch:", exactMatch, "shouldShowAdd:", shouldShowAdd);
      setPendingAdd(shouldShowAdd);
    } else {
      setFilteredCities(cities);
      setPendingAdd(null);
    }
  }, [searchTerm, cities]);

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleSelect = (cityName) => {
    onSelectCity(cityName);
    setSearchTerm("");  // Clear search term after selecting
    setIsOpen(false);
    setIsFocused(false);
    setPendingAdd(null);
  };

  const handleAddCity = async () => {
    if (!pendingAdd || !onAddCity || disabled) return;
    console.log("SearchableCityDropdown handleAddCity called");
    try {
      setIsAddingCity(true);
      const newCity = await onAddCity(pendingAdd); // handled in parent
      onSelectCity(newCity.city_name || pendingAdd);  // Select the newly added city
      setSearchTerm("");  // Reset search term
      setIsOpen(false);
      setPendingAdd(null);
    } catch (err) {
      console.error("Error adding city:", err);
    } finally {
      setIsAddingCity(false);
    }
  };

  const handleCancelAdd = () => {
    setPendingAdd(null);
    setSearchTerm("");
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-[#007eef]" />
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-neutral-800 text-[13px] font-normal mb-3">
        City <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        className={`form-input block w-full px-4 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm text-[12px] pr-10 text-neutral-500 `}
        // Display selected city or search term (pending add city name if typed)
        value={isFocused ? searchTerm : selectedCity || selectedCity}
        onChange={(e) => {
          console.log("Input onChange:", e.target.value);
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          console.log("Input focused");
          handleFocus();
        }}
        placeholder="Search or add city..."
        style={{ textTransform: "capitalize" }} 
      />
      <div className="absolute right-3 top-12 transform -translate-y-1/2 flex items-center">
        <MdExpandMore className="text-gray-400" size={18} />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <div
                key={city.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
                onClick={() => handleSelect(city.city_name)}
              >
                <span>{city.city_name}</span>
                {selectedCity === city.city_name && (
                  <MdCheck className="text-gray-400" size={18} />
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No cities found
            </div>
          )}

          {(() => {
            console.log("Render check - pendingAdd:", pendingAdd, "disabled:", disabled, "should show:", pendingAdd && !disabled);
            return pendingAdd && !disabled;
          })() && (
            <div className="px-4 py-2 border-t text-sm flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#007eef]">
                <MdAdd size={18} />
                <span>Add "{pendingAdd}"</span>
              </div>
              <div className="flex items-center gap-2">
                {isAddingCity ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        console.log("Add city button clicked");
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddCity();
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MdCheck className="text-green-600" size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAdd}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MdClose className="text-red-600" size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {pendingAdd && disabled && (
            <div className="px-4 py-2 border-t text-sm text-gray-500">
              Please select a state first to add a city
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableCityDropdown;