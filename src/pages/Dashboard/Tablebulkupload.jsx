// import React from "react";
// import BulkUpload from "../../components/BulkUpload";
// import DocumentView from "../../pages/Documents/DocumentView";

// function Tablebulkupload() {
//   return (
//     <section className="row gy-4 gy-md-0"> 
//       <div className="col-md-4">
//         <BulkUpload />
//       </div>
//       <div className="col-md-8">
//         <DocumentView />
//       </div>
//     </section>
//   );
// }

// export default Tablebulkupload;

import React from "react";
import BulkUpload from "../../components/BulkUpload";
import DocumentView from "../../pages/Documents/DocumentView";

function Tablebulkupload() {
  return (
    <section className="d-flex flex-column gap-5 p-5">
      <BulkUpload />
      <DocumentView />
    </section>
  );
}

export default Tablebulkupload;
