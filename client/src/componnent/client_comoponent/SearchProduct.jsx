import React, { useState, useEffect } from "react";
import { Range } from "react-range";
import { useNavigate } from 'react-router-dom';

const SearchProduct = ({
  handleFilter = () => {},
  searchByname = () => {},
  filterByBrand = () => {},
  filterByState = () => {},
  filterByCategory = () => {},
  filterByminMaxPrice = () => {},
  filterByAvailable = () => {},
  filterByDate = () => {},
  fetchProducts = () => {}
  
}) => {
  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [state, setState] = useState("")
  const [category, setCategory] = useState("")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [available, setAvailable] = useState(false)
  const [date, setDate] = useState("")

  const [useBrand, setUseBrand] = useState(false)
  const [useStateField, setUseStateField] = useState(false)
  const [useCategory, setUseCategory] = useState(false)
  const [useAvailable, setUseAvailable] = useState(false)
  const [useDate, setUseDate] = useState(false)
  const [usePrice, setUsePrice] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const delay = setTimeout(() => {
      if (name.trim()) {
        handleFilter(searchByname, name)
      } else {
        fetchProducts()
      }
    }, 400)
    return () => clearTimeout(delay)
  }, [name])

  useEffect(() => {
    if (useBrand) {
      if (brand.trim()) {
        handleFilter(filterByBrand, brand)
      } else {
        fetchProducts()
      }
    }
  }, [brand, useBrand])

  useEffect(() => {
    if (useStateField) {
      if (state.trim()) {
        handleFilter(filterByState, state)
      } else {
        fetchProducts()
      }
    }
  }, [state, useStateField])

  useEffect(() => {
    if (useCategory) {
      if (category.trim()) {
        handleFilter(filterByCategory, category)
      } else {
        fetchProducts()
      }
    }
  }, [category, useCategory])

  useEffect(() => {
    if (useAvailable) {
      handleFilter(filterByAvailable, available)
    } else {
      fetchProducts()
    }
  }, [available, useAvailable])

  useEffect(() => {
    if (useDate) {
      if (date) {
        handleFilter(filterByDate, date)
      } else {
        fetchProducts()
      }
    }
  }, [date, useDate])

  useEffect(() => {
    if (usePrice) {
      handleFilter(() => filterByminMaxPrice(priceRange[0], priceRange[1]), null)
    } else {
      fetchProducts()
    }
  }, [priceRange, usePrice])

  const MIN = 0
  const MAX = 5000
  const STEP = 10

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Search & Filter Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <input
          type="text"
          className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search by product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <label className="flex items-center space-x-2 mb-3">
            <input type="checkbox" checked={useBrand} onChange={() => setUseBrand(!useBrand)} />
            <span className="text-gray-800 font-medium">Filter by Brand</span>
          </label>
          {useBrand && (
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <label className="flex items-center space-x-2 mb-3">
            <input type="checkbox" checked={useStateField} onChange={() => setUseStateField(!useStateField)} />
            <span className="text-gray-800 font-medium">Filter by State</span>
          </label>
          {useStateField && (
              <select
    value={state}
    onChange={(e) => setState(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
  >
    <option value="">Select a state</option>
    <option value="new">New</option>
    <option value="used">Used</option>

  </select>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <label className="flex items-center space-x-2 mb-3">
            <input type="checkbox" checked={useCategory} onChange={() => setUseCategory(!useCategory)} />
            <span className="text-gray-800 font-medium">Filter by Category</span>
          </label>
          {useCategory && (
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
  >
    <option value="">Select a category</option>
    <option value="Laptop">Laptop</option>
    <option value="Phone">Phone</option>
    <option value="TV">TV</option>
    <option value="Accessories">Accessories</option>
    <option value="Others">Others</option>
  </select>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <label className="flex items-center space-x-2 mb-3">
            <input type="checkbox" checked={usePrice} onChange={() => setUsePrice(!usePrice)} />
            <span className="text-gray-800 font-medium">Filter by Price</span>
          </label>
          {usePrice && (
            <div>
              <div className="text-sm text-gray-600 mb-2">
                Min: {priceRange[0]} TND | Max: {priceRange[1]} TND
              </div>
              <Range
                step={STEP}
                min={MIN}
                max={MAX}
                values={priceRange}
                onChange={setPriceRange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-2 w-full bg-gray-300 rounded-full"
                    style={{ ...props.style }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-4 w-4 bg-indigo-600 rounded-full shadow-md"
                  />
                )}
              />
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <label className="flex items-center space-x-2 mb-3">
            <input type="checkbox" checked={useAvailable} onChange={() => setUseAvailable(!useAvailable)} />
            <span className="text-gray-800 font-medium">Filter by Availability</span>
          </label>
          {useAvailable && (
            <select
              value={available}
              onChange={(e) => setAvailable(e.target.value === "true")}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <label className="flex items-center space-x-2 mb-3">
            <input type="checkbox" checked={useDate} onChange={() => setUseDate(!useDate)} />
            <span className="text-gray-800 font-medium">Filter by Date</span>
          </label>
          {useDate && (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchProduct
