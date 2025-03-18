const baseUrl = "http://185.28.22.219:8006/api/";

export const Apipath = {
  loginUser: baseUrl + "user/login",
  checkEmailExists: baseUrl + "user/checkEmailExists",
  sendVeerificationEmail: baseUrl + "user/sendVerificationEmail",
  verifyEmail: baseUrl + "user/verifyEmail",
  registerUser: baseUrl + "user/register",
  uploadMedia: baseUrl + "user/upload_user_media",
  getDashboardData: baseUrl + "dashboard/businessDashboard",
  searchCustomers: baseUrl + "dashboard/searchCustomers",
  addProfileView: baseUrl + "dashboard/addProfileView",
  updateProfile: baseUrl + "user/updateProfile",
  addNewCustomer: baseUrl + "dashboard/addCustomer",
  getAllCustomers: baseUrl + "dashboard/customersNear",
  addReview: baseUrl + "dashboard/addReview",
  getReviews: baseUrl + "review/loadReviews",
  loadMessages: baseUrl + "review/loadMessages",
  sendMessage: baseUrl + "review/sendMessage",
  addYap: baseUrl + "dashboard/addReview",
  getProfile: baseUrl + "user/my_profile",
  disputeReview: baseUrl + "review/disputeReview",
  paySettle: baseUrl + "review/paySettlementOffer",
  loadChats: baseUrl + "review/loadChats",
  getNotifications: baseUrl + "user/notifications",
  searchHistory: baseUrl + "user/searchHistory",
  getAdminDashboardData: baseUrl + "admin/adminDashboard",
  getAdminAnalyticsData: baseUrl + "admin/adminAnalytics",
  sendSettlementOffer: baseUrl + "review/sendSettlementOffer",
  deleteSearch: baseUrl + "dashboard/deleteSearch",
  deleteMedia: baseUrl + "user/delete_media",
  socialLogin: baseUrl + "user/SocialLogin",
  getResolutions: baseUrl + "admin/adminResolutions",
  hideFromPlatform: baseUrl + "admin/hideFromPlatform",
  deleteFromPlatform: baseUrl + "admin/deleteFromPlatform",
  deleteAccout: baseUrl + "admin/deleteAccount",
  suspendAccount: baseUrl + "admin/suspendAccount",
  unsuspendAccount: baseUrl + "admin/unsuspendAccount",
  resolveOrReject: baseUrl + "admin/resolveOrReject",
  PurchaseCredits: `${baseUrl}user/purchaseCredits`,
  checkLicenseExists: `${baseUrl}user/checkDriverLicenseExists`,
  getCards: `${baseUrl}user/list_cards`,
  getTransactions: `${baseUrl}user/get_transactions`,
  addNewCard: `${baseUrl}user/add_card`,
  adminUnreadChat: `${baseUrl}user/readNotifications`,

  //chat
  createChat: `${baseUrl}review/createchat`,


  getSuspendedUsers:`${baseUrl}admin/suspendedUsers`
};
