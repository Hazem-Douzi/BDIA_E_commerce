
import axios from "axios"

const url = `http://localhost:8080/api/product/search`


export const searchByname = async (term) => {
  try {
    const res = await axios.get(`${url}?name=${term}`)
    console.log("product found", res.data)
    return res.data
  } catch (error) {
    console.error("product not found", error)
    throw error
  }
}

export const filterByBrand = async (term) => {
  try {
    const res = await axios.get(`${url}?brand=${term}`)
    console.log("product found", res.data)
    return res.data
  } catch (error) {
    console.error("product not found", error)
    throw error
  }
}

export const filterByState = async (term) => {
  try {
    const res = await axios.get(`${url}?state=${term}`)
    console.log("product found", res.data)
    return res.data
  } catch (error) {
    console.error("product not found", error)
    throw error
  }
}

export const filterByCategory = async (term) => {
  try {
    const res = await axios.get(`${url}?category=${term}`)
    console.log("product found", res.data)
    return res.data
  } catch (error) {
    console.error("product not found", error)
    throw error
  }
}

export const filterByminMaxPrice = async (minPrice, maxPrice) => {
  try {
    const res = await axios.get(`${url}?minPrice=${minPrice}&maxPrice=${maxPrice}`)
    console.log("product found", res.data)
    return res.data
  } catch (error) {
    console.error("product not found", error)
    throw error
  }
}

export const filterByAvailable = async (term) => {
  try {
    const res = await axios.get(`${url}?available=${term}`)
    console.log("product found", res.data)
    return res.data
  } catch (error) {
    console.error("product not found", error)
    throw error
  }
}

export const filterByDate = async (term) => {
  try {
    const res = await axios.get(`${url}?date=${term}`)
    console.log("product found", res.data)
    return res.data
  } catch (error) {
    console.error("product not found", error)
    throw error
  }
}

// export const searchByFullName = async (term) => {
//   try {
//     const res = await axios.get(`${url}?fullName=${term}`)
//     console.log("product found", res.data)
//     return res.data
//   } catch (error) {
//     console.error("product not found", error)
//     throw error
//   }
// }

// export const filterByPhoneNumber = async (term) => {
//   try {
//     const res = await axios.get(`${url}?phoneNumber=${term}`)
//     console.log("product found", res.data)
//     return res.data
//   } catch (error) {
//     console.error("product not found", error)
//     throw error
//   }
// }

// export const filterByAdress = async (term) => {
//   try {
//     const res = await axios.get(`${url}?address=${term}`)
//     console.log("product found", res.data)
//     return res.data
//   } catch (error) {
//     console.error("product not found", error)
//     throw error
//   }
// }