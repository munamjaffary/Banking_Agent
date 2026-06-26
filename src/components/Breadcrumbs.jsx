import React from "react";
import { Link } from "react-router";

function Breadcrumbs({ title, currentPage }) {
  return (
    <div className="breadcrumb-row">
      <h2>{title}</h2>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to={"/"}>Dashboard</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {currentPage}
          </li>
        </ol>
      </nav>
    </div>
  );
}

export default Breadcrumbs;
