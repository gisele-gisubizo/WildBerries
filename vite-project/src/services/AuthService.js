import axios from "axios";

const API_URL = "http://10.41.201.248:4000/users";

export const registerCustomer = async (customerData) => {
  const res = await axios.post(`${API_URL}/register`, customerData);
  return res.data;
};

export const registerSeller = async (sellerData) => {
  const formData = new FormData();
  formData.append("name", sellerData.name);
  formData.append("email", sellerData.email);
  formData.append("phone", sellerData.phone);
  formData.append("password", sellerData.password);
  formData.append("address", sellerData.address);
  formData.append("idCopy", sellerData.idCopy);
  formData.append("licenseDoc", sellerData.licenseDoc);

  const res = await axios.post(`${API_URL}/register-seller`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
