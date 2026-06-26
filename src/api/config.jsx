export const baseUrl = "http://202.47.59.77:8080";
export const endpoints = {
  document: {
    documentupload: "/documents/upload",
    documentuploadprogress: "/documents/upload/progress",
    documentingestprogress: "/documents/ingest/progress",
    documentuploadcancel: "/documents/upload/cancel",
    documentcategories: "/documents/categories",
    documentdelete: "/documents/delete",
    documentpreview: "/documents/preview",
    documentdownload: "/documents/download",
    documenttable: "/documents/table",
  },

  upload: {
    onecategory: "/upload/one_category",
    bulkcategory: "/upload/bulk_category",
  },

  chat: {
    retrieval: "/chat/retrieval",
    response: "/chat/response",
    reference: "/chat/reference",
    audio: "/chat/audio",
  },
  auth: {
    signup: "/access/signup",
    login: "/access/login",
    authentication: "/access/authentication",
    activate: "/access/activate",
    resendverification: "/access/resend_verification",
    removingaccount: "/access/removing_account",
    profile: "/access/profile",
    sessionid: "/access/session_id",
  },
};
