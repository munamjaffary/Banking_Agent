import React from "react";
import FolderIcon from "../../../assets/icons/dashboardfolder.svg";
import PieChart from "../components/PieChart";
import ClaimsChart from "../components/ClaimsChart";
import Select from "react-select";
import { customSelectStyles } from "../../../utils/SelectStyle";
import { useSelector } from "react-redux";

function Widgets() {
  const user = useSelector((state) => state.auth.user);
  const documentTypeOptions = [
    { value: "month", label: "Month" },
    { value: "week", label: "Week" },
    { value: "day", label: "Day" },
  ];
  return (
    <>
      <div className="dashboard-headings">
        <h4>Good morning, {user?.username || "Harry"}</h4>
        <p>Stay on top of your tasks, monitor progress, and track status</p>
      </div>
      <section className="widgets-container">
        <div className="widgets">
          <div className="widgets-body">
            <div className="widgets-boxs">
              <div className="widget-box">
                <div className="widget-box-heading">
                  <p className="title">Total Doc</p>
                  <div>
                    <img src={FolderIcon} alt="Total Doc" />
                  </div>
                </div>

                <h3>350</h3>
                <span>+7% This month</span>
              </div>

              <div className="widget-box">
                <div className="widget-box-heading">
                  <p className="title">Deleted Doc</p>
                  <div>
                    <img src={FolderIcon} alt="Deleted Doc" />
                  </div>
                </div>
                <h3>350</h3>
                <span>+7% This month</span>
              </div>

              <div className="widget-box">
                <div className="widget-box-heading">
                  <p className="title">This Week</p>
                  <div>
                    <img src={FolderIcon} alt="Add This Week" />
                  </div>
                </div>
                <h3>350</h3>
                <span>+7% This month</span>
              </div>

              <div className="widget-box">
                <div className="widget-box-heading">
                  <p className="title">Last Updated</p>
                  <div>
                    <img src={FolderIcon} alt="Last Updated" />
                  </div>
                </div>
                <h3>09/1/26</h3>
                <span>+7% This month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="widgets">
          <div className="widgets-claim-body">
            <div className="widget-claim-row">
              <div className="widget-claim-headings">
                <p>Data Activity</p>
                <span>Doc upload status graph</span>
              </div>

              <div className="inputs-container">
                <Select
                  options={documentTypeOptions}
                  isSearchable={true}
                  styles={customSelectStyles}
                  placeholder="Month"
                />
              </div>
            </div>

            <ClaimsChart />
          </div>
        </div>

        <div className="widgets">
          <div className="widgets-claim-body">
            <div className="widget-claim-row">
              <div className="widget-claim-headings">
                <p>Data Activity</p>
                <span>Doc upload status graph</span>
              </div>

              <div className="inputs-container">
                <Select
                  options={documentTypeOptions}
                  isSearchable={true}
                  styles={customSelectStyles}
                  placeholder="Month"
                />
              </div>
            </div>
            <PieChart />
          </div>
        </div>
      </section>
    </>
  );
}

export default Widgets;
